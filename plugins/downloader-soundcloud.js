import yts from 'yt-search';
import fetch from 'node-fetch';

let tempStorage = {};

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `❌ Uso incorrecto del comando. Escribe algo como:\n*${usedPrefix + command} Billie Eilish - Bellyache*`,
      m
    );
  }

  const yt_play = await search(args.join(' '));

  const texto1 = `
⌘━─━─≪𓄂*Barboza*𝄢─━─━⌘

➷ *Título⤿:* ${yt_play[0].title}
➷ *Subido⤿:* ${yt_play[0].ago}
➷ *Duración⤿:* ${secondString(yt_play[0].duration.seconds)}
➷ *Vistas⤿:* ${MilesNumber(yt_play[0].views)}
➷ *URL⤿:* ${yt_play[0].url}

➤ *Su Resultado Se Está Enviando Por Favor Espere....* ☄    

> _*©Prohibido La Copia, Código Oficial  
 De Barboza™*_
`.trim();

  tempStorage[m.sender] = { url: yt_play[0].url, title: yt_play[0].title };

  await conn.sendMessage(
    m.chat,
    {
      image: { url: yt_play[0].thumbnail },
      caption: texto1,
      buttons: [
        { buttonId: `.ytmp3 ${yt_play[0].url}`, buttonText: { displayText: "♥️ [Audio]" }, type: 1 },
        { buttonId: `.ytmp4 ${yt_play[0].url}`, buttonText: { displayText: "♥️ [Video]" }, type: 1 }
      ],
      viewOnce: true,
      headerType: 4
    },
    { quoted: m }
  );
};

handler.before = async (m, { conn }) => {
  const text = m.text.trim().toLowerCase();
  if (!['🎶', 'audio', '📽', 'video'].includes(text)) return;

  const userVideoData = tempStorage[m.sender];
  if (!userVideoData || !userVideoData.url) {
    return conn.reply(m.chat, '❌ No hay resultado disponible. Intenta de nuevo.', m);
  }

  try {
    if (text === '🎶' || text === 'audio') {
      await conn.reply(m.chat, '⏳ Procesando audio...', m);
      const res = await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${userVideoData.url}`);
      const { data } = await res.json();
      await conn.sendMessage(
        m.chat,
        { audio: { url: data.dl }, mimetype: 'audio/mpeg' },
        { quoted: m }
      );
    } else if (text === '📽' || text === 'video') {
      await conn.reply(m.chat, '⏳ Procesando video...', m);
      const res = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${userVideoData.url}`);
      const { data } = await res.json();
      await conn.sendMessage(
        m.chat,
        { video: { url: data.dl }, fileName: `video.mp4`, mimetype: 'video/mp4', caption: `⟡ *${userVideoData.title}*` },
        { quoted: m }
      );
    }
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '❌ Hubo un error al procesar tu solicitud.', m);
  } finally {
    delete tempStorage[m.sender];
  }
};

handler.command = /^(play|play2)$/i;
export default handler;

// Funciones auxiliares
async function search(query, options = {}) {
  const search = await yts.search({ query, hl: 'es', gl: 'ES', ...options });
  return search.videos;
}

function MilesNumber(number) {
  return number.toLocaleString();
}

function secondString(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d > 0 ? d + 'd ' : ''}${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s > 0 ? s + 's' : ''}`;
}