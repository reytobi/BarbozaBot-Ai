import { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, PHONENUMBER_MCC } from '@whiskeysockets/baileys'
import crypto from 'crypto'
import fs from 'fs'
import pino from 'pino'
import readline from 'readline'
import { makeWASocket } from '../lib/simple.js'

global.conns = global.conns || []

let handler = async (m, { conn: _conn, args, usedPrefix, command, isOwner, isROwner }) => {
  if (!global.db.data.settings[_conn.user.jid].jadibotmd && !isROwner) {
    return _conn.reply(m.chat, '🚩 Este comando está deshabilitado por mi creador.', m)
  }

  let parent = args[0] && args[0] === 'plz' ? _conn : await global.conn
  if (!((args[0] && args[0] === 'plz') || (await global.conn).user.jid === _conn.user.jid)) {
    return _conn.reply(m.chat, `「💭」Solo puedes usar este comando en el bot principal.\n\n• Wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix + command}`, m)
  }

  async function serbot() {
    const folderName = crypto.randomBytes(10).toString('hex').slice(0, 8)
    const sessionFolder = `./BarbozaJadibot/${folderName}`
    if (!fs.existsSync(sessionFolder)) fs.mkdirSync(sessionFolder, { recursive: true })

    if (args[0]) {
      fs.writeFileSync(`${sessionFolder}/creds.json`, Buffer.from(args[0], 'base64').toString('utf-8'))
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionFolder)
    const { version } = await fetchLatestBaileysVersion()
    const phoneNumber = m.sender.split('@')[0].replace(/\D/g, '')

    const conn = makeWASocket({
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      browser: ['BarbozaBot-Code', 'Desktop', '2.0.0'],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      getMessage: async () => ({ conversation: 'Hola, soy un subbot Barboza.' }),
      version
    })

    // Si no está registrado, generar código de vinculación
    if (!conn.authState.creds.registered && Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
      setTimeout(async () => {
        let codeBot = await conn.requestPairingCode(`+${phoneNumber}`)
        codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
        let mensaje = `🚀 *S E R C O D E - B A R B O Z A B O T*\n\n> Usa este código en tu WhatsApp para convertirte en subbot:\n\n*🔑 Código:* ${codeBot}\n\n🪄 Pasos:\n1. Entra a WhatsApp Web.\n2. Vincula por código.\n3. Pega el código aquí.\n\n❗ Este código solo sirve para *+${phoneNumber}*`
        await parent.reply(m.chat, mensaje, m)
      }, 3000)
    }

    conn.ev.on("creds.update", saveCreds)
    global.conns.push(conn)

    let handler = await import('../handler.js')
    let isInit = true

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin } = update
      if (isNewLogin) conn.isInit = true

      const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
      if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
        let i = global.conns.indexOf(conn)
        if (i >= 0) {
          global.conns.splice(i, 1)
          delete global.conns[i]
        }
        await parent.reply(m.chat, '❌ Subbot perdió conexión. Intentando reconectar...', m)
      }

      if (connection === "open") {
        conn.isInit = true
        global.conns.push(conn)
        await parent.reply(m.chat, '✅ Subbot conectado exitosamente vía código.', m)
      }

      if (global.db.data == null) loadDatabase()
    }

    let creloadHandler = async function (restatConn) {
      try {
        const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handler = Handler
      } catch (e) {
        console.error(e)
      }

      if (restatConn) {
        try { conn.ws.close() } catch {}
        conn.ev.removeAllListeners()
        conn = makeWASocket(connectionOptions)
        isInit = true
      }

      if (!isInit) {
        conn.ev.off('messages.upsert', conn.handler)
        conn.ev.off('connection.update', conn.connectionUpdate)
        conn.ev.off('creds.update', conn.credsUpdate)
      }

      conn.handler = handler.handler.bind(conn)
      conn.connectionUpdate = connectionUpdate.bind(conn)
      conn.credsUpdate = saveCreds.bind(conn, true)

      conn.ev.on('messages.upsert', conn.handler)
      conn.ev.on('connection.update', conn.connectionUpdate)
      conn.ev.on('creds.update', conn.credsUpdate)

      isInit = false
      return true
    }

    conn.ev.on('connection.update', connectionUpdate)
    await creloadHandler(false)

    // limpieza automática si no se conecta en 60 segundos
    setTimeout(() => {
      if (!conn.user) {
        try { conn.ws.close() } catch {}
        conn.ev.removeAllListeners()
        let i = global.conns.indexOf(conn)
        if (i >= 0) {
          global.conns.splice(i, 1)
          delete global.conns[i]
        }
        fs.rmSync(sessionFolder, { recursive: true, force: true })
      }
    }, 60000)
  }

  serbot()
}

handler.help = ['code']
handler.tags = ['jadibot']
handler.command = ['code']
export default handler

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
