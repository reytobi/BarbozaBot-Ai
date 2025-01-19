import fetch from 'node-fetch';
import translate from '@vitalets/google-translate-api';

// Handler principal para el juego Akinator
const handler = async (m, { conn, usedPrefix, command, text }) => {
  // Verifica si el mensaje es en grupo
  if (m.isGroup) return;

  // Inicializa la propiedad 'akinator' si no existe
  if (!global.db.data.users[m.sender].akinator) {
    global.db.data.users[m.sender].akinator = {
      sesi: false,
      soal: null,
      server: null,
      frontaddr: null,
      session: null,
      signature: null,
      question: null,
      progression: null,
      step: null,
    };
  }

  const aki = global.db.data.users[m.sender].akinator;

  // Manejo de comando 'end'
  if (text === 'end') {
    if (!aki.sesi) {
      return m.reply('*[❗] Actualmente no estás en una sesión (partida) de Akinator.*');
    }
    aki.sesi = false;
    aki.soal = null;
    m.reply('*[✅] Se eliminó con éxito la sesión (partida) de Akinator.*');
  } else {
    // Verifica si ya hay una sesión activa
    if (aki.sesi) {
      return conn.reply(m.chat, '*[❗] Todavía estás en una sesión (partida) de Akinator.*', aki.soal);
    }
    try {
      // Verifica que la API key esté definida
      if (!lolkeysapi) {
        return m.reply('*[❗] API key no está definida.*');
      }

      // Llama a la API para iniciar la sesión de Akinator
      const res = await fetch(`https://api.lolhuman.xyz/api/akinator/start?apikey=${lolkeysapi}`);
      const anu = await res.json();

      // Manejo de errores de la API
      if (anu.status !== 200) {
        throw new Error('*[❗] Error, inténtalo más tarde.*');
      }

      // Desestructura los resultados de la API
      const { server, frontaddr, session, signature, question, progression, step } = anu.result;

      // Guarda los datos de la sesión
      aki.sesi = true;
      aki.server = server;
      aki.frontaddr = frontaddr;
      aki.session = session;
      aki.signature = signature;
      aki.question = question;
      aki.progression = progression;
      aki.step = step;

      // Traduce la pregunta a español
      const resultes2 = await translate(question, { to: 'es', autoCorrect: false });
      let txt = `🎮 *𝐀𝐊𝐈𝐍𝐀𝐓𝐎𝐑* 🎮\n\n*𝙹𝚄𝙶𝙰𝙳𝙾𝚁: @${m.sender.split('@')[0]}*\n*𝙿𝚁𝙴𝙶𝚄𝙽𝚃𝙰: ${resultes2.text}*\n\n`;
      txt += '*0 - Sí*\n';
      txt += '*1 - No*\n';
      txt += '*2 - No sé*\n';
      txt += '*3 - Probablemente sí*\n';
      txt += '*4 - Probablemente no*\n\n';
      txt += `*Usa el comando ${usedPrefix + command} end para salir de la sesión (partida) de Akinator.*`;

      // Envía el mensaje con la pregunta
      const soal = await conn.sendMessage(m.chat, { text: txt, mentions: [m.sender] }, { quoted: m });
      aki.soal = soal;
    } catch (e) {
      console.error(e);
      m.reply('*[❗] Error, inténtalo más tarde.*');
    }
  }
};

// Configuración del handler
handler.menu = ['akinator'];
handler.tags = ['fun'];
handler.command = /^(akinator)$/i;

export default handler;