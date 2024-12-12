import {googleImage} from '@bochilteam/scraper';
const handler = async (m, {conn, text, usedPrefix, command}) => {
  if (!text) return conn.reply(m.chat, `*💛 Uso Correcto: ${usedPrefix + command} Nakano Nino*`, m, rcanal);
  conn.reply(m.chat, '💛 *Descargando su imagen...*', m, {
    contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, showAdAttribution: true,
      title: packname,
      body: wm,
      previewType: 0, thumbnail: icono,
      sourceUrl: canal }}})
  const res = await googleImage(text);
  const image = await res.getRandom();
  const link = image;
  const messages = [
    { 
      "title": "Imagen 1",
      "description": dev,
      "url": await res.getRandom(),
      "buttons": [[]],
    },
    { 
      "title": "Imagen 2",
      "description": dev,
      "url": await res.getRandom(),
      "buttons": [[]],
    },
    { 
      "title": "Imagen 3",
      "description": dev,
      "url": await res.getRandom(),
      "buttons": [[]],
    },
    { 
      "title": "Imagen 4",
      "description": dev,
      "url": await res.getRandom(),
      "buttons": [[]],
    },
  ];
  const carousel = {
    "type": "template",
    "template": {
      "type": "carousel",
      "columns": messages,
    },
  };
  await conn.sendMessage(m.chat, carousel, { quoted: m });
};
handler.help = ['imagen <query>'];
handler.tags = ['buscador', 'tools', 'descargas'];
handler.command = ['image', 'imagen'];
handler.register = true;
export default handler;