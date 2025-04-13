import { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, MessageRetryMap, makeCacheableSignalKeyStore, jidNormalizedUser, PHONENUMBER_MCC } from '@whiskeysockets/baileys';
import moment from 'moment-timezone';
import NodeCache from 'node-cache';
import readline from 'readline';
import qrcode from "qrcode";
import crypto from 'crypto';
import fs from "fs";
import pino from 'pino';
import * as ws from 'ws';
const { CONNECTING } = ws;
import { Boom } from '@hapi/boom';
import { makeWASocket } from '../lib/simple.js';

if (!(global.conns instanceof Array)) global.conns = [];

let handler = async (m, { conn: _conn, args, usedPrefix, command, isOwner, isROwner }) => {
  if (!global.db.data.settings[_conn.user.jid].jadibotmd && !isROwner) {
    return conn.reply(m.chat, '🚩 Este comando está deshabilitado por mi creador.', m);
  }

  let parent = args[0] && args[0] === 'plz' ? _conn : await global.conn;
  if (!((args[0] && args[0] === 'plz') || (await global.conn).user.jid === _conn.user.jid)) {
    return conn.reply(m.chat, `「💭」Solo puedes usar este comando en el bot principal.\n\n• Wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix + command}`, m);
  }

  async function serbot() {
    // Carpeta única para sesiones
    const sessionFolder = `./barbozaJadiBot/${m.sender.split('@')[0]}`;
    if (!fs.existsSync(sessionFolder)) {
      fs.mkdirSync(sessionFolder, { recursive: true });
    }

    // Si hay credenciales guardadas, las carga
    const { state, saveState, saveCreds } = await useMultiFileAuthState(sessionFolder);

    // Si ya está registrado, se conecta directamente
    if (state.creds.registered) {
      await parent.reply(m.chat, '✅ *Reconectando tu sesión existente...*', m);
      await startConnection(state, saveCreds);
      return;
    }

    // Si no está registrado, genera código de vinculación
    await parent.reply(m.chat, '🚀 *Generando código de vinculación...*', m);
    const phoneNumber = m.sender.split('@')[0];
    const cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');

    if (!Object.keys(PHONENUMBER_MCC).some(v => cleanedNumber.startsWith(v))) {
      return parent.reply(m.chat, '❌ *Tu número no es compatible con WhatsApp.*', m);
    }

    const connectionOptions = await getConnectionOptions(state);
    const conn = makeWASocket(connectionOptions);

    const codeBot = await conn.requestPairingCode(cleanedNumber);
    const formattedCode = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;

    const instructions = `
🚀 *SERBOT - VINCULAR SUB-BOT* 🚀

*Usa este código para vincularte:*
🔢 *Código:* ${formattedCode}

📌 *Pasos:*
1. Abre WhatsApp en tu teléfono.
2. Toca ⋮ > *Dispositivos vinculados* > *Vincular un dispositivo*.
3. Ingresa el código arriba.

*Nota:* Este código solo funciona para el número que lo solicitó.`.trim();

    await parent.reply(m.chat, instructions, m);
    await startConnection(state, saveCreds);
  }

  async function startConnection(state, saveCreds) {
    const { version } = await fetchLatestBaileysVersion();
    const connectionOptions = {
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      mobile: false,
      browser: ['Ubuntu', 'Edge', '110.0.1587.56'],
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
      },
      markOnlineOnConnect: true,
      version,
    };

    const conn = makeWASocket(connectionOptions);
    conn.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode;
        if (code === DisconnectReason.loggedOut) {
          fs.rmdirSync(`./barbozaJadiBot/${m.sender.split('@')[0]}`, { recursive: true });
          parent.reply(m.chat, '❌ *Sesión eliminada. Usa `.sercode` nuevamente.*', m);
        }
      } else if (connection === 'open') {
        parent.reply(m.chat, '✅ *¡Sub-Bot vinculado correctamente!*', m);
      }
    });

    conn.ev.on('creds.update', saveCreds);
    global.conns.push(conn);
  }

  serbot();
};

handler.help = ['sercode'];
handler.tags = ['jadibot'];
handler.command = ['sercode'];
export default handler;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getConnectionOptions(state) {
  const { version } = await fetchLatestBaileysVersion();
  return {
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    mobile: false,
    browser: ['Ubuntu', 'Edge', '110.0.1587.56'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
    },
    markOnlineOnConnect: true,
    version,
  };
}
