import { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser } from '@whiskeysockets/baileys'
import qrcode from 'qrcode'
import fs from 'fs'
import pino from 'pino'
import crypto from 'crypto'
import NodeCache from 'node-cache'
import { makeWASocket } from '../lib/simple.js'

global.conns = global.conns || []

let handler = async (m, { conn, args, usedPrefix, command, isOwner, isPrems, isROwner }) => {
  const allowedGroup = '120363418071387498@g.us'

  if (m.chat !== allowedGroup) {
    return conn.reply(m.chat, '❌ Acceso denegado. Este comando solo está permitido en el grupo autorizado se puede aquí https://chat.whatsapp.com/DuhNOmNlx9n3QRGFkvwkqX.', m)
  }

  const bot = global.db.data.settings[conn.user.jid] || {}
  if (!bot.jadibotmd) return m.reply('💛 Este Comando Se Encuentra Desactivado Por Mi Creador')

  let parentw = args[0] && args[0] == "plz" ? conn : await global.conn
  if (!(args[0] && args[0] == 'plz' || (await global.conn).user.jid == conn.user.jid)) {
    return conn.reply(m.chat, `「💭」Solo puedes usar este comando en el bot principal.\n\n• Wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix + command}`, m)
  }

  async function serbot() {
    let serbotFolder = crypto.randomBytes(10).toString('hex').slice(0, 8)
    let folderSub = `./BarbozaJadibot/${serbotFolder}`
    if (!fs.existsSync(folderSub)) fs.mkdirSync(folderSub, { recursive: true })

    if (args[0]) {
      fs.writeFileSync(`${folderSub}/creds.json`, Buffer.from(args[0], 'base64').toString('utf-8'))
    }

    const { state, saveCreds } = await useMultiFileAuthState(folderSub)
    const msgRetryCounterCache = new NodeCache()
    const { version } = await fetchLatestBaileysVersion()

    const connectionOptions = {
      logger: pino({ level: 'silent' }),
      printQRInTerminal: true,
      browser: ['BarbozaSubbot', 'Edge', '2.0.0'],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" }))
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      getMessage: async () => ({ conversation: 'Hola, soy un subbot Barboza.' }),
      msgRetryCounterCache,
      version
    }

    let conn = makeWASocket(connectionOptions)
    conn.isInit = false
    let isInit = true

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update

      if (isNewLogin) conn.isInit = true

      if (qr) {
        let txt = '🎩 *S E R B O T - S U B B O T* 🍭\n\n> *Escanea este QR para ser un Sub Bot*\n\n💛 Pasos para escanear:\n\n1. Haga click en los 3 puntos\n2. Toque dispositivos vinculados\n3. Escanea este QR\n\n> Nota: Este código QR expira en 30 segundos.'
        let sendQR = await parentw.sendFile(m.chat, await qrcode.toDataURL(qr, { scale: 8 }), "qrcode.png", txt, m)
        setTimeout(() => {
          parentw.sendMessage(m.chat, { delete: sendQR.key })
        }, 30000)
      }

      const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
      if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
        let i = global.conns.indexOf(conn)
        if (i >= 0) {
          global.conns.splice(i, 1)
          delete global.conns[i]
        }
        await parentw.reply(conn.user.jid, "🚩 Conexión perdida con el servidor del subbot.", m)
      }

      if (global.db.data == null) loadDatabase()

      if (connection === "open") {
        conn.isInit = true
        global.conns.push(conn)
        await parentw.reply(m.chat, args[0]
          ? '🌺 Subbot reconectado correctamente.'
          : '✅ Vinculaste un subbot con éxito.', m)
        await sleep(3000)
        if (!args[0]) {
          await parentw.reply(conn.user.jid, '🚩 Usa tu token cuando quieras reconectar tu subbot.', m)
        }
      }
    }

    const timeoutId = setTimeout(() => {
      if (!conn.user) {
        try { conn.ws.close() } catch {}
        conn.ev.removeAllListeners()
        let i = global.conns.indexOf(conn)
        if (i >= 0) {
          global.conns.splice(i, 1)
          delete global.conns[i]
        }
        fs.rmdirSync(folderSub, { recursive: true })
      }
    }, 30000)

    let handler = await import("../handler.js")

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
        conn.ev.off("messages.upsert", conn.handler)
        conn.ev.off("connection.update", conn.connectionUpdate)
        conn.ev.off("creds.update", conn.credsUpdate)
      }

      conn.handler = handler.handler.bind(conn)
      conn.connectionUpdate = connectionUpdate.bind(conn)
      conn.credsUpdate = saveCreds.bind(conn, true)
      conn.ev.on("messages.upsert", conn.handler)
      conn.ev.on("connection.update", conn.connectionUpdate)
      conn.ev.on("creds.update", conn.credsUpdate)
      isInit = false
      return true
    }

    conn.ev.on("connection.update", connectionUpdate)
    conn.ev.on("creds.update", saveCreds)
    await creloadHandler(false)
  }

  serbot()
}

handler.help = ["serbot"]
handler.tags = ["serbot"]
handler.command = ["jadibot", "qr", "serbot"]
export default handler

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
        }
