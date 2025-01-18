import fetch from 'node-fetch';
import translate from '@vitalets/google-translate-api';

const handler = async (m, { conn, usedPrefix, command, text }) => {
  if (m.isGroup) return;

  // Asegúrate de que la propiedad 'akinator' esté inicializada
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

  if (text === 'end') {
    if (!aki.sesi) {
      return m.reply(
        '*[❗] Actualmente no estás en una sesión (partida) de Akinator.*'
      );
    }
    aki.sesi = false;
    aki.soal = null;
    m.reply('*[❗] Se eliminó con éxito la sesión (partida) de Akinator.*');
  } else {
    if (aki.sesi) {
      return conn.reply(
        m.chat,
        '*[❗] Todavía estás en una sesión (partida) de Akinator.*',
        aki.soal
      );
    }
    try {
      const res = await fetch(
        `https://api.lolhuman.xyz/api/akinator/start?apikey=${lolkeysapi}`
      );
      const anu = await res.json();
      if (anu.status !== 200) {
        throw '*[❗] Error, inténtalo más tarde.*';
      }
      const {
        server,
        frontaddr,
        session,
        signature,
        question,
        progression,
        step,
      } = anu.result;

      aki.sesi = true;
      aki.server = server;
      aki.frontaddr = frontaddr;
      aki.session = session;
      aki.signature = signature;
      aki.question = question;
      aki.progression = progression;
      aki.step = step;

      const resultes2 = await translate(question, { to: 'es', autoCorrect: false });
      let txt = `🎮 *𝐀𝐊𝐈𝐍𝐀𝐓𝐎𝐑* 🎮\n\n*𝙹𝚄𝙶𝙰𝙳𝙾𝚁: @${m.sender.split('@')[0]}*\n*𝙿𝚁𝙴𝙶𝚄𝙽𝚃𝙰: ${resultes2.text}*\n\n`;
      txt += '*0 - Sí*\n';
      txt += '*1 - No*\n';
      txt += '*2 - No sé*\n';
      txt += '*3 - Probablemente sí*\n';
      txt += '*4 - Probablemente no*\n\n';
      txt += `*Usa el comando ${usedPrefix + command} end para salir de la sesión (partida) de Akinator.*`;

      const soal = await conn.sendMessage(
        m.chat,
        { text: txt, mentions: [m.sender] },
        { quoted: m }
      );
      aki.soal = soal;
    } catch (e) {
      console.error(e);
      m.reply('*[❗] Error, inténtalo más tarde.*');
    }
  }
};

handler.menu = ['akinator'];
handler.tags = ['fun'];
handler.command = /^(akinator)$/i;

export default handler;