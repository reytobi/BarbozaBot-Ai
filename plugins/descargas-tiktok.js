/*
- By WillZek 
- https://github.com/WillZek
- 🌃 Moon Force Team
- https://whatsapp.com/channel/0029Vb4Dnh611ulGUbu7Xg1q
*/

// TIKTOK - DOWNLOADER 📽️

import fetch from 'node-fetch';

let MF = async(m, { conn, text }) => {

if (!text) return conn.reply(m.chat, '🌃 Ingrese Un Link Para Descargarlo.', m);

let apiInfo = await(await fetch(`https://delirius-apiofc.vercel.app/search/tiktoksearch?query=${text}`)).json();

  if (!/(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(text)) return m.reply('✖️ Ingrese Un Link Válido');

let force = apiInfo.meta[0];

let txt = `\`𝚃𝙸𝙺𝚃𝙾𝙺 𝑋 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰\`\n\n`
txt += `☪︎ *Título:* ${force.title}\n`
txt += `☪︎ *Duración:* ${force.duration}\n`
txt += `☪︎ *Likes:* ${force.like}\n`
txt += `☪︎ *Comentarios:* ${force.coment}\n`
txt += `☪︎ *Compartidas:* ${force.share}\n\n> `
txt += `♫ Descargando Video, Por Favor Espere.`;

m.react('🕒');
m.reply(txt);

const ttdl = await tiktokdl(text);

conn.sendMessage(m.chat, { video: { url: ttdl.result.video_no_watermark }, mimetype: 'video/mp4' }, { quoted: m });
m.react('✅');
}

MF.command = ['tiktok', 'ttdl'];

export default MF;

async function tiktokdl(url) {
    let apiDownload = await (await fetch(`https://api.ssateam.my.id/api/tiktok?url=${url}&apikey=makangratis`)).json();
    return apiDownload;
}