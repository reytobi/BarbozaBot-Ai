
import { sticker} from '../lib/sticker.js';
import { webp2png} from '../lib/webp2mp4.js';
import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';

const REDES = 'https://tu-enlace-o-dominio.com'; // URL predeterminada
const ICONS = null; // Define "icons" si es necesario

const handler = async (m, { conn, args}) => {
  try {
    let q = m.quoted? m.quoted: m;
    let mime = q.mimetype || q.mediaType || '';

    if (!/webp|image|video/g.test(mime)) {
      if (args[0] && isUrl(args[0])) {
        return sendSticker(m, conn, args[0]);
}
      return m.reply('💫 Debes enviar una imagen, video o un URL válido.');
}

    let media = await q.download?.();
    if (!media) return m.reply('⚡ Envía primero el archivo y luego usa el comando.');

    if (/video/g.test(mime) && q.seconds> 8) {
      return m.reply('☁️ ¡El video no puede durar más de 8 segundos!');
}

    let stickerFile = await processSticker(media, mime);
    return sendSticker(m, conn, stickerFile);

} catch (e) {
    console.error(e);
    return m.reply('❌ Ocurrió un error al generar el sticker.');
}
};

const processSticker = async (media, mime) => {
  if (/webp/g.test(mime)) return await webp2png(media);
  if (/image/g.test(mime)) return await uploadImage(media);
  if (/video/g.test(mime)) return await uploadFile(media);
  return await uploadImage(media);
};

const sendSticker = (m, conn, stickerFile) => {
  conn.sendFile(m.chat, stickerFile, 'sticker.webp', '', m, true, {
    contextInfo: {
      forwardingScore: 200,
      isForwarded: false,
      externalAdReply: {
        showAdAttribution: false,
        title: 'Sticker Bot 🤖',
        body: 'Generador de Stickers',
        mediaType: 2,
        sourceUrl: REDES,
        thumbnail: ICONS
}
}
}, { quoted: m});
};

const isUrl = (text) => {
  return /^https?:\/\/.+\.(jpe?g|gif|png)$/.test(text);
};

handler.help = ['sticker <imagen>', 'sticker <url>'];
handler.tags = ['herramientas'];
handler.command = ['s', 'sticker', 'stiker'];

export default handler;