/*
reconexión de subbots automática al reiniciar el bot
by github.com/DIEGO-OFC adaptado para BarbozaBot
*/

import fs from 'fs'
import path from 'path'
import pino from 'pino'
import { 
  makeWASocket, 
  useMultiFileAuthState, 
  makeCacheableSignalKeyStore, 
  fetchLatestBaileysVersion, 
  jidNormalizedUser 
} from '@whiskeysockets/baileys'

global.conns = global.conns || []

export async function connectSubBots() {
  const subBotDir = './BarbozaJadibot/'
  if (!fs.existsSync(subBotDir)) {
    console.log('🔃 No hay subbots para reconectar.')
    return
  }

  const folders = fs.readdirSync(subBotDir).filter(name =>
    fs.existsSync(path.join(subBotDir, name, 'creds.json'))
  )

  for (const folder of folders) {
    try {
      const folderPath = path.join(subBotDir, folder)
      const { state, saveCreds } = await useMultiFileAuthState(folderPath)
      const { version } = await fetchLatestBaileysVersion()

      const conn = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['BarbozaBot-AI', 'Desktop', '1.0.0'],
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => ({
          conversation: 'Hola, soy un subbot Barboza.'
        }),
        version
      })

      conn.ev.on('creds.update', saveCreds)
      global.conns.push(conn)
      console.log(`✅ Subbot reconectado: ${folder}`)
    } catch (e) {
      console.error(`❌ Error al reconectar subbot ${folder}:`, e.message)
    }
  }
}
