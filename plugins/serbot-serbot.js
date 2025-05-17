const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = await import("@whiskeysockets/baileys");
import qrcode from "qrcode";
import nodeCache from "node-cache";
import fs from "fs";
import path from "path";
import pino from "pino";
import ws from "ws";
import chalk from 'chalk';
import { makeWASocket } from "../lib/simple.js";

const MAX_SUBBOTS = 100;
const users = [...new Set([...global.conns?.filter(conn => conn?.user?.jid && conn?.ws?.socket?.readyState !== ws.CLOSED) || []])];

async function loadSubbots() {
  const serbotFolders = fs.readdirSync('./' + jadi).filter(folder => fs.statSync(path.join('./', jadi, folder)).isDirectory());

  for (const folder of serbotFolders) {
    if (users.length >= MAX_SUBBOTS) {
      console.log(chalk.cyan(`☕ Límite de ${MAX_SUBBOTS} subbots alcanzado.`));
      break;
    }

    const folderPath = path.join('./', jadi, folder);
    const { state, saveCreds } = await useMultiFileAuthState(folderPath);
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
      version,
      keepAliveIntervalMs: 30000,
      printQRInTerminal: false,
      logger: pino({ level: "fatal" }),
      auth: state,
      browser: [`Sylph`, "IOS", "4.1.0"],
    };

    let conn = makeWASocket(connectionOptions);
    conn.isInit = false;
    let isInit = true;
    let reconnectionAttempts = 0;

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin } = update;
      if (isNewLogin) conn.isInit = true;

      const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
      if (code && code !== DisconnectReason.loggedOut && conn?.ws?.socket == null) {
        const index = global.conns.indexOf(conn);
        if (index >= 0) {
          global.conns.splice(index, 1);
        }
      }

      if (connection === "open") {
        conn.uptime = new Date();
        conn.isInit = true;
        global.conns.push(conn);
        await joinChannels(conn);
      }

      if (connection === 'close' || connection === 'error') {
        reconnectionAttempts++;
        let waitTime = [1000, 2000, 3000, 5000, 10000][Math.min(reconnectionAttempts - 1, 4)] || 1000;

        setTimeout(async () => {
          try {
            conn.ws?.close();
            conn.ev.removeAllListeners();
            conn = makeWASocket(connectionOptions);
            conn.handler = handler.handler.bind(conn);
            conn.connectionUpdate = connectionUpdate.bind(conn);
            conn.credsUpdate = saveCreds.bind(conn, true);
            conn.ev.on('messages.upsert', conn.handler);
            conn.ev.on('connection.update', conn.connectionUpdate);
            conn.ev.on('creds.update', conn.credsUpdate);
            await reloadHandler(false);
          } catch (error) {
            console.error(chalk.red('Error durante la reconexión:', error));
          }
        }, waitTime);
      }

      if (code === DisconnectReason.loggedOut && fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(chalk.yellow(`Carpeta de credenciales eliminada para el subbot ${folder}.`));
      }
    }

    let handler = await import("../handler.js");

    async function reloadHandler(restatConn) {
      try {
        const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error);
        if (Handler) handler = Handler;
      } catch (e) {
        console.error(e);
      }
      if (restatConn) {
        try {
          conn.ws?.close();
        } catch {}
        conn.ev.removeAllListeners();
        conn = makeWASocket(connectionOptions);
        isInit = true;
      }
      if (!isInit) {
        conn.ev.off("messages.upsert", conn.handler);
        conn.ev.off("connection.update", conn.connectionUpdate);
        conn.ev.off('creds.update', conn.credsUpdate);
      }
      conn.handler = handler.handler.bind(conn);
      conn.connectionUpdate = connectionUpdate.bind(conn);
      conn.credsUpdate = saveCreds.bind(conn, true);
      conn.ev.on("messages.upsert", conn.handler);
      conn.ev.on("connection.update", conn.connectionUpdate);
      conn.ev.on("creds.update", conn.credsUpdate);
      isInit = false;
      return true;
    }
    reloadHandler(false);
    conn.ev.on('connection.update', connectionUpdate);
    conn.ev.on('creds.update', saveCreds);
  }
  if (global.conns?.length > 0) {
    console.log(chalk.yellow(`🌿 Se reconectaron ${global.conns.length} subbots`));
  }
}

await loadSubbots().catch(console.error);

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  if (users.length >= MAX_SUBBOTS) {
    return conn.reply(m.chat, `*≡ Lo siento, se ha alcanzado el límite de ${MAX_SUBBOTS} subbots. Intenta más tarde.*`, m);
  }

  const isCode = ["code", "--code"].includes(args[0]?.toLowerCase());
  const userName = m.mentionedJid?.[0]?.split('@')[0] || m.sender.split('@')[0];
  const userPath = path.join('./', jadi, userName);

  if (!fs.existsSync(userPath)) {
    fs.mkdirSync(userPath, { recursive: true });
  }

  if (args[0] && !isCode) {
    try {
      const jsonString = Buffer.from(args[0], "base64").toString("utf-8");
      JSON.parse(jsonString);
      fs.writeFileSync(path.join(userPath, 'creds.json'), jsonString);
    } catch (e) {
      return m.reply("≡ Ocurrió un error al procesar el código.\n\nUsa *#delsesi* y luego ejecuta *#serbot --code* de nuevo.");
    }
  }

  try {
    const credsPath = path.join(userPath, 'creds.json');
    if (fs.existsSync(credsPath)) {
      const creds = JSON.parse(fs.readFileSync(credsPath));
      if (creds?.registered === false) {
        fs.rmSync(credsPath, { force: true });
      }
    }
  } catch (e) {
    return m.reply(`≡ Ocurrió un error al procesar el código.\n\nUsa *#delsesi* y luego ejecuta *#${command}* de nuevo.`);
  }

  async function initSubBot() {
    const { version } = await fetchLatestBaileysVersion();
    const cache = new nodeCache();
    const { state, saveCreds } = await useMultiFileAuthState(userPath);

    const config = {
      printQRInTerminal: false,
      logger: pino({ level: "silent" }),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
      },
      msgRetry: (msg) => {},
      msgRetryCache: cache,
      version,
      syncFullHistory: true,
      browser: isCode ? ["Ubuntu", "Chrome", "110.0.5585.95"] : ["Sylphiette", "Chrome", "2.0.0"],
      defaultQueryTimeoutMs: undefined,
      getMessage: async () => ({ conversation: "Sylph" })
    };

    let subBot = makeWASocket(config);
    let isConnected = false;

    async function handleConnectionUpdate(update) {
      const { connection, lastDisconnect, qr } = update;

      if (qr && !isCode) {
        try {
          const qrBuffer = await qrcode.toBuffer(qr, { scale: 8 });
          await conn.sendMessage(m.chat, { image: qrBuffer, caption: `💨 Escanea este código QR para conectarte como subbot.\n\n> Barboza ~` }, { quoted: m });
        } catch (error) {
          console.error("Error al generar o enviar el código QR:", error);
        }
      } else if (qr && isCode) {
        await conn.sendMessage(m.chat, { text: `😛 Introduce el siguiente código para convertirte en subbot.\n\n> Barboza ~` }, { quoted: m });
        try {
          const pairingCode = await subBot.requestPairingCode(m.sender.split`@`[0], "SYLPHUWU");
          await conn.sendMessage(m.chat, { text: pairingCode }, { quoted: m });
        } catch (error) {
          console.error("Error al solicitar el código de emparejamiento:", error);
          await conn.sendMessage(m.chat, { text: "⚠️ Hubo un error al generar el código de emparejamiento." }, { quoted: m });
        }
      }

      const statusCode = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;

      if (connection === "close") {
        if (statusCode === DisconnectReason.restartRequired) {
          console.log(chalk.yellow("\n≡ Tiempo de conexión agotado, reconectando..."));
          initSubBot();
        } else if (statusCode === DisconnectReason.loggedOut) {
          fs.rmSync(userPath, { recursive: true, force: true });
          await conn.sendMessage(m.chat, { text: "≡ *Conexión perdida...*" }, { quoted: m });
        } else if (statusCode === DisconnectReason.badSession) {
          await conn.sendMessage(m.chat, { text: "≡ La conexión se ha cerrado, deberá de conectarse manualmente usando el comando *.serbot* o *.code*" }, { quoted: m });
        } else if (statusCode === DisconnectReason.timedOut) {
          console.log(chalk.yellow("\n≡ Tiempo de conexión agotado, reconectando...."));
          initSubBot();
        } else if (statusCode === 405) {
          fs.rmSync(path.join(userPath, 'creds.json'), { force: true });
          await conn.sendMessage(m.chat, { text: "≡ Reenvía nuevamente el comando." }, { quoted: m });
        } else {
          console.log(chalk.red(`\n🍂 Razón de la desconexión desconocida: ${statusCode || ""} >> ${connection || ""}`));
        }
      }

      if (connection === "open") {
        subBot.uptime = new Date();
        global.conns.push(subBot);
        isConnected = true;
        await conn.sendMessage(m.chat, { text: args[0] && !isCode ? "🌙 *¡Está conectado!*\nPor favor espere se están cargando los mensajes..." : "¡Conectado con éxito!" }, { quoted: m });
        await joinChannels(subBot);
      }
    }

    subBot.ev.on("connection.update", handleConnectionUpdate);
    subBot.ev.on("creds.update", saveCreds);

    const handlerModule = await import("../handler.js");
    subBot.handler = handlerModule.handler.bind(subBot);
    subBot.ev.on("messages.upsert", subBot.handler);
  }

  try {
    initSubBot();
  } catch (error) {
    console.error("Error al iniciar el subbot:", error);
    m.reply(`Ocurrió un error al intentar conectar el subbot. Intenta borrar tu sesión con *#delsesi* y vuelve a intentarlo.`);
  }
};

handler.help = ["serbot", "serbot --code", "code"];
handler.tags = ["serbot"];
handler.command = ["serbot", "code"];

export default handler;

async function joinChannels(conn) {
  try {
    await conn.newsletterFollow("120363414007802886@newsletter");
    await conn.newsletterFollow("120363375378707428@newsletter");
    //console.log(chalk.blue(`El subbot : ${conn.user.jid.split("@")[0]} siguió con éxito el canal.`));
  } catch (error) {
    console.error("Error al seguir los canales:", error);
  }
}
