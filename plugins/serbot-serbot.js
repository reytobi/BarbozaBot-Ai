 const {
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";
import qrcode from "qrcode";
import nodeCache from "node-cache";
import fs from "fs";
import path from "path";
import pino from "pino";
import util from "util"; // No se usa en el código proporcionado
import * as ws from "ws";
import {
  child,
  spawn,
  exec
} from "child_process"; // 'child' no se usa
import chalk from 'chalk';
import {
  makeWASocket
} from "../lib/simple.js";

// --- Variables globales y configuraciones ---
// Asegúrate de que 'dev', 'jadi' y 'global.ch' estén definidos en algún lugar globalmente o pasados como parámetros.
// Por ejemplo:
// const dev = "TU_NUMERO_DE_DEV";
// const jadi = "sessions"; // Carpeta donde se guardarán las sesiones
// global.ch = {}; // Objeto para los canales

let rtx = `✨ Escanea este código QR para conectarte como subbot.\n\n> ${dev}`;
let rtx2 = `⚡ Introduce el siguiente código para convertirte en subbot.\n\n> ${dev}`;

// Inicialización de global.conns
if (!global.conns instanceof Array) {
  global.conns = [];
}

const MAX_SUBBOTS = 100;
// Filtrar solo conexiones válidas y mapearlas a un array de conexiones
const activeConnections = () => [...new Set(global.conns.filter((conn) => conn.user && conn.ws?.socket?.readyState !== ws.CLOSED))];

// --- Función para cargar subbots existentes ---
async function loadSubbots() {
  const serbotFoldersPath = `./${jadi}`;

  // Verificar si la carpeta existe
  if (!fs.existsSync(serbotFoldersPath)) {
    console.log(chalk.yellow(`Advertencia: La carpeta '${serbotFoldersPath}' no existe. No se cargarán subbots.`));
    return;
  }

  const serbotFolders = fs.readdirSync(serbotFoldersPath);
  for (const folder of serbotFolders) {
    if (activeConnections().length >= MAX_SUBBOTS) {
      console.log(chalk.cyan(`☕ Límite de ${MAX_SUBBOTS} subbots alcanzado. No se cargarán más.`));
      break;
    }
    const folderPath = path.join(serbotFoldersPath, folder);

    if (fs.statSync(folderPath).isDirectory()) {
      try {
        const {
          state,
          saveCreds
        } = await useMultiFileAuthState(folderPath);
        const {
          version
        } = await fetchLatestBaileysVersion();

        const connectionOptions = {
          version,
          keepAliveIntervalMs: 30000,
          printQRInTerminal: false,
          logger: pino({
            level: "silent"
          }), // Cambiado a 'silent' para menos logs
          auth: state,
          browser: [`Crow`, "IOS", "4.1.0"],
        };

        let conn = makeWASocket(connectionOptions);
        conn.isInit = false; // Se inicializa como false
        let isInitHandler = false; // Nueva variable para controlar la inicialización del handler

        let reconnectionAttempts = 0;
        const maxReconnectionAttempts = 5; // Límite de intentos de reconexión

        const connectionUpdate = async (update) => {
          const {
            connection,
            lastDisconnect,
            isNewLogin
          } = update;

          if (isNewLogin) {
            conn.isInit = true; // Solo si es un nuevo login
          }

          const disconnectCode = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.payload?.statusCode;

          if (connection === "open") {
            conn.uptime = new Date();
            conn.isInit = true;
            global.conns.push(conn);
            console.log(chalk.green(`🌙 Subbot ${folder} conectado exitosamente.`));
            reconnectionAttempts = 0; // Resetear intentos al conectar
            await joinChannels(conn); // Unirse a canales al conectar
          } else if (connection === 'close') {
            console.log(chalk.yellow(`Subbot ${folder} desconectado. Razón: ${DisconnectReason[lastDisconnect.reason] || disconnectCode || 'Desconocida'}`));

            if (disconnectCode === DisconnectReason.loggedOut) {
              if (fs.existsSync(folderPath)) {
                fs.rmSync(folderPath, {
                  recursive: true,
                  force: true
                }); // Usar fs.rmSync para eliminar carpetas y archivos
                console.log(chalk.yellow(`Carpeta de credenciales eliminada para el subbot ${folder}.`));
              }
              // Eliminar la conexión de global.conns si se cerró la sesión
              const index = global.conns.indexOf(conn);
              if (index > -1) {
                global.conns.splice(index, 1);
              }
              return; // No intentar reconectar si se cerró la sesión
            }

            if (reconnectionAttempts < maxReconnectionAttempts) {
              reconnectionAttempts++;
              let waitTime = 1000 * Math.pow(2, reconnectionAttempts - 1); // Backoff exponencial
              waitTime = Math.min(waitTime, 30000); // Limitar el tiempo de espera máximo

              console.log(chalk.blue(`Intentando reconectar subbot ${folder} en ${waitTime / 1000} segundos... (Intento ${reconnectionAttempts}/${maxReconnectionAttempts})`));
              setTimeout(async () => {
                try {
                  // Limpiar listeners antes de recrear la conexión
                  conn.ev.removeAllListeners();
                  conn.ws.close();
                  // Recrear la conexión con las mismas opciones
                  conn = makeWASocket(connectionOptions);
                  // Volver a configurar el handler y los listeners
                  await creloadHandler(conn, saveCreds); // Pasar conn y saveCreds para el handler
                } catch (error) {
                  console.error(chalk.red(`Error durante la reconexión del subbot ${folder}:`, error));
                }
              }, waitTime);
            } else {
              console.log(chalk.red(`❌ Fallo al reconectar el subbot ${folder} después de ${maxReconnectionAttempts} intentos. Eliminando conexión.`));
              // Si falla la reconexión después de varios intentos, eliminar la conexión
              const index = global.conns.indexOf(conn);
              if (index > -1) {
                global.conns.splice(index, 1);
              }
            }
          }
        };

        let handler = await import("../handler.js"); // Carga inicial del handler

        // Función para recargar el handler y reconfigurar los listeners
        const creloadHandler = async (currentConn, currentSaveCreds) => {
          try {
            // Importar el handler con un timestamp para evitar caché
            const Handler = await import(`../handler.js?update=${Date.now()}`);
            if (Object.keys(Handler || {}).length) {
              handler = Handler;
            }
          } catch (e) {
            console.error(chalk.red("Error al recargar el handler:", e));
          }

          // Desactivar listeners si ya están inicializados
          if (isInitHandler) {
            currentConn.ev.off("messages.upsert", currentConn.handler);
            currentConn.ev.off("connection.update", currentConn.connectionUpdate);
            currentConn.ev.off('creds.update', currentConn.credsUpdate);
          }

          // Reconfigurar handler y listeners
          currentConn.handler = handler.handler.bind(currentConn);
          currentConn.connectionUpdate = connectionUpdate.bind(currentConn);
          currentConn.credsUpdate = currentSaveCreds.bind(currentConn); // Asegúrate de que saveCreds esté ligado correctamente
          currentConn.ev.on("messages.upsert", currentConn.handler);
          currentConn.ev.on("connection.update", currentConn.connectionUpdate);
          currentConn.ev.on("creds.update", currentConn.credsUpdate);
          isInitHandler = true; // Marcar que el handler está inicializado
          return true;
        };

        await creloadHandler(conn, saveCreds); // Llamar al handler con la conexión actual
      } catch (error) {
        console.error(chalk.red(`Error al cargar el subbot de la carpeta ${folder}:`, error));
      }
    }
  }
}

await loadSubbots().catch(console.error);

// --- Handler principal para el comando 'serbot' y 'code' ---
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command,
  isOwner
}) => {
  // Asegúrate de que 'global.conn' esté definido y sea el bot principal
  if (!((args[0] && args[0] === 'plz') || (global.conn && global.conn.user && global.conn.user.jid === conn.user.jid))) {
    return m.reply(`≡ 🍁 \`Este comando solo puede ser usado en el bot principal:\`\n\nwa.me/${global.conn?.user?.jid?.split('@')[0]}?text=${usedPrefix}code`);
  }

  if (activeConnections().length >= MAX_SUBBOTS) {
    return conn.reply(m.chat, `*≡ Lo siento, se ha alcanzado el límite de ${MAX_SUBBOTS} subbots. Por favor, intenta más tarde.*`, m);
  }

  const isCodeCommand = command === "code" || (args[0] && /(--code|code)/.test(args[0].trim()));
  let pairingCode;
  let qrMessage;
  const userJid = m.sender; // El JID del usuario que ejecuta el comando
  const userName = userJid.split('@')[0];
  const userSessionPath = path.join(`./${jadi}`, userName);

  // Crear la carpeta de sesión si no existe
  if (!fs.existsSync(userSessionPath)) {
    fs.mkdirSync(userSessionPath, {
      recursive: true
    });
  }

  // Manejo de código de sesión proporcionado
  if (args[0] && !isCodeCommand) { // Si hay un argumento pero no es el comando 'code'
    try {
      const jsonString = Buffer.from(args[0], "base64").toString("utf-8");
      const jsonParsed = JSON.parse(jsonString);
      fs.writeFileSync(path.join(userSessionPath, "creds.json"), JSON.stringify(jsonParsed, null, "\t"));
      m.reply("≡ Credenciales de sesión procesadas exitosamente. Conectando como subbot...");
      // Forzar la recarga de subbots para que intente conectar con las nuevas credenciales
      await loadSubbots().catch(console.error);
      return;
    } catch (e) {
      console.error(chalk.red("Error al procesar las credenciales:", e));
      return m.reply("≡ Ocurrió un error al procesar el código.\n\nPor favor, ejecuta `*#delsesion*` y luego `*#serbot --code*` de nuevo, o envía las credenciales de sesión en base64 directamente.");
    }
  }

  // Comprobar si ya existe una sesión para el usuario y si está registrada
  if (fs.existsSync(path.join(userSessionPath, "creds.json"))) {
    try {
      const creds = JSON.parse(fs.readFileSync(path.join(userSessionPath, "creds.json"), "utf-8"));
      if (creds && creds.registered === false) {
        fs.unlinkSync(path.join(userSessionPath, "creds.json")); // Eliminar credenciales si no están registradas
        m.reply("≡ Tu sesión anterior no estaba registrada. Generando una nueva...");
      } else if (activeConnections().some(c => c.user.jid === userJid)) {
        return m.reply("≡ Ya tienes un subbot conectado. Para reconectar, usa `*#delsesion*` y luego `*#serbot*`.");
      }
    } catch (e) {
      console.error(chalk.red("Error al leer credenciales existentes:", e));
      fs.unlinkSync(path.join(userSessionPath, "creds.json")); // Eliminar credenciales corruptas
      m.reply("≡ Se encontraron credenciales corruptas. Generando una nueva sesión...");
    }
  }

  async function initSubBot() {
    const {
      version
    } = await fetchLatestBaileysVersion();
    const cache = new nodeCache(); // Reutilizar el cache

    // Se cambió a 'path.join' para la ruta de la sesión
    const {
      state,
      saveCreds
    } = await useMultiFileAuthState(userSessionPath);

    const config = {
      printQRInTerminal: false,
      logger: pino({
        level: "silent"
      }),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({
          level: "silent"
        }))
      },
      msgRetryCounterCache: cache, // Uso correcto de nodeCache
      version, // Usar la versión más reciente
      syncFullHistory: true,
      browser: isCodeCommand ? ["Ubuntu", "Chrome", "110.0.5585.95"] : ["Crow", "Chrome", "2.0.0"],
      defaultQueryTimeoutMs: undefined,
      getMessage: async msgId => {
        // Implementar un store si es necesario para getMessage. Por ahora, se mantiene simple.
        // if (store) { return store.loadMessage(msgId) }
        return {
          conversation: "Crow"
        };
      }
    };

    let subBot = makeWASocket(config);
    subBot.isInit = false; // Se inicializa como false
    let isConnectedHandler = false; // Variable para controlar la inicialización del handler del subbot

    const handleConnectionUpdate = async (update) => {
      const {
        connection,
        lastDisconnect,
        isNewLogin,
        qr
      } = update;

      if (isNewLogin) {
        subBot.isInit = true;
      }

      if (qr && !isCodeCommand) {
        qrMessage = await conn.sendMessage(m.chat, {
          image: await qrcode.toBuffer(qr, {
            scale: 8
          }),
          caption: rtx,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true
          }
        }, {
          quoted: m
        }); // Usar 'm' como quoted
        return;
      }
      if (qr && isCodeCommand) {
        await conn.sendMessage(m.chat, {
          text: rtx2,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true
          }
        }, {
          quoted: m
        });

        await sleep(3000); // Usar la función sleep definida al final
        pairingCode = await subBot.requestPairingCode(userName); // Usar userName para el pairing code

        await conn.sendMessage(m.chat, {
          text: pairingCode,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true
          }
        }, {
          quoted: m
        });
      }

      const disconnectCode = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.payload?.statusCode;

      const closeAndRemoveConnection = async (deleteFolder = false) => {
        try {
          subBot.ws.close();
        } catch {}
        subBot.ev.removeAllListeners();
        const index = global.conns.indexOf(subBot);
        if (index > -1) {
          global.conns.splice(index, 1);
        }
        if (deleteFolder && fs.existsSync(userSessionPath)) {
          fs.rmSync(userSessionPath, {
            recursive: true,
            force: true
          });
          console.log(chalk.yellow(`Carpeta de credenciales eliminada para el subbot ${userName}.`));
        }
      };

      if (connection === "close") {
        console.log(chalk.red(`Subbot de ${userName} desconectado. Razón: ${DisconnectReason[lastDisconnect?.reason] || disconnectCode || 'Desconocida'}`));

        switch (disconnectCode) {
          case DisconnectReason.loggedOut:
            await closeAndRemoveConnection(true);
            return m.reply("≡ *Sesión cerrada. Debes volver a conectarte usando el comando #serbot o #code.*");
          case DisconnectReason.restartRequired:
            console.log("\n≡ Tiempo de conexión agotado, reconectando...");
            await closeAndRemoveConnection(false); // No eliminar la carpeta en un reinicio
            initSubBot(); // Intentar reiniciar la conexión
            break;
          case DisconnectReason.connectionLost:
            console.log("\n≡ Conexión perdida con el servidor, reconectando....");
            await closeAndRemoveConnection(false);
            initSubBot(); // Intentar reiniciar la conexión
            break;
          case DisconnectReason.badSession:
            await closeAndRemoveConnection(true);
            return m.reply("≡ La sesión es inválida. Deberás conectarte manualmente usando el comando `*.serbot*` o `*.code*`.");
          case DisconnectReason.timedOut:
            console.log("\n≡ Tiempo de conexión agotado, reconectando....");
            await closeAndRemoveConnection(false);
            initSubBot(); // Intentar reiniciar la conexión
            break;
          default:
            console.log(chalk.red(`\n🪐 Razón de desconexión desconocida para ${userName}: ${disconnectCode || ""} >> ${connection || ""}`));
            await closeAndRemoveConnection(true); // En caso de error desconocido, considerar eliminar la sesión
            m.reply("≡ Se ha producido un error inesperado en la conexión de tu subbot. Intenta conectarte de nuevo.");
            break;
        }
      }

      if (global.db.data === null) {
        // Asegúrate de que 'loadDatabase' esté definido y disponible globalmente
        // loadDatabase();
      }

      if (connection === "open") {
        subBot.uptime = new Date();
        subBot.isInit = true;
        global.conns.push(subBot);
        await conn.sendMessage(m.chat, {
          text: args[0] ? "🌙 *¡Está conectado!\nPor favor espere se están cargando los mensajes...*" : "¡Conectado con éxito!"
        }, {
          quoted: m
        });
        await joinChannels(subBot);

        // Si no se proporcionaron credenciales, se puede enviar el código base64 al usuario (opcional)
        /*
        if (!args[0]) {
          const credsBase64 = Buffer.from(fs.readFileSync(path.join(userSessionPath, "creds.json"), "utf-8")).toString("base64");
          conn.sendMessage(m.chat, {
            text: `${usedPrefix}${command} ${credsBase64}`
          }, { quoted: m });
        }
        */
      }
    };

    // Intervalo para verificar si el subbot está activo. Si no lo está, intentar limpiar la conexión.
    setInterval(async () => {
      if (!subBot.user || subBot.ws?.socket?.readyState === ws.CLOSED) {
        console.log(chalk.red(`Subbot de ${userName} inactivo. Intentando limpiar y eliminar la conexión.`));
        await closeAndRemoveConnection(true); // Eliminar la carpeta si el subbot está inactivo
      }
    }, 60000); // Cada minuto

    let handlerModule = await import("../handler.js");

    const updateHandler = async (shouldReconnect) => {
      try {
        const updatedModule = await import(`../handler.js?update=${Date.now()}`);
        if (Object.keys(updatedModule || {}).length) {
          handlerModule = updatedModule;
        }
      } catch (error) {
        console.error(chalk.red("Error al recargar el handler del subbot:", error));
      }

      if (shouldReconnect) {
        const chats = subBot.chats;
        try {
          subBot.ws.close();
        } catch {}
        subBot.ev.removeAllListeners();
        subBot = makeWASocket(config, {
          chats: chats
        });
        isConnectedHandler = true;
      }
      if (!isConnectedHandler) {
        subBot.ev.off("messages.upsert", subBot.handler);
        subBot.ev.off("connection.update", subBot.connectionUpdate);
        subBot.ev.off("creds.update", subBot.credsUpdate);
      }
      // Se eliminó la lógica de isBanned basada en el tiempo del último evento ya que era redundante o potencialmente problemática.
      // Si se necesita un sistema de ban, debe implementarse de forma más robusta.
      subBot.handler = handlerModule.handler.bind(subBot);
      subBot.connectionUpdate = handleConnectionUpdate.bind(subBot);
      subBot.credsUpdate = saveCreds.bind(subBot);
      subBot.ev.on("messages.upsert", subBot.handler);
      subBot.ev.on("connection.update", subBot.connectionUpdate);
      subBot.ev.on("creds.update", subBot.credsUpdate);
      isConnectedHandler = false;
      return true;
    };

    updateHandler(false);
  }

  // Iniciar el subbot
  initSubBot();
};

handler.help = ["serbot", "serbot --code", "code"];
handler.tags = ["serbot"];
handler.command = ["serbot", "code"];

export default handler;

// --- Funciones auxiliares ---
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function joinChannels(conn) {
  if (global.ch && Object.values(global.ch).length > 0) {
    for (const channelId of Object.values(global.ch)) {
      await conn.newsletterFollow(channelId).catch((e) => {
        console.error(chalk.red(`Error al seguir el canal ${channelId}:`, e.message));
      });
    }
    console.log(chal