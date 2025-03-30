import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';
import { webp2png } from '../lib/webp2mp4.js';

const redes = 'https://tu-enlace-o-dominio.com';
const icons = null;

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let imageUrl = '';
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime))
        if ((q.msg || q).seconds > 8)
          return m.reply('☁️ *¡El video no puede durar más de 8 segundos!*');
      let media = await q.download?.();
      if (!media)
        return conn.reply(m.chat, '☃️ *_¿Y el video? Intenta enviar primero imagen/video/gif y luego responde con el comando._*', m);
      try {
        if (/webp/g.test(mime)) {
          imageUrl = await webp2png(media);
        } else if (/image/g.test(mime)) {
          imageUrl = await uploadImage(media);
        } else if (/video/g.test(mime)) {
          imageUrl = await uploadFile(media);
        }
        if (typeof imageUrl !== 'string') imageUrl = await uploadImage(media);
      } catch (e) {
        console.error(e);
        throw e;
      }
    } else if (args[0]) {
      if (isUrl(args[0]))
        imageUrl = args[0];
      else
        return m.reply('💫 El URL es incorrecto');
    }
  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, 'Error al procesar la imagen', m);
  } finally {
    if (imageUrl) {
      await conn.sendFile(m.chat, imageUrl, '', '© Prohibido la copia, Código Oficial de MediaHub™', m, false, {
        contextInfo: {
          forwardingScore: 200,
          isForwarded: false,
          externalAdReply: {
            showAdAttribution: false,
            title: global.packname,
            body: 'botbarboza - Ai ☃️',
            mediaType: 2,
            sourceUrl: redes,
            thumbnail: icons
          }
        }
      });
    } else {
      return conn.reply(m.chat, '⚡ *_¿Y el video? Intenta enviar primero imagen/video/gif y luego responde con el comando._*', m);
    }
  }
};

handler.help = ['ver <img>'];
handler.tags = ['herramientas'];
handler.command = ['ver'];

export default handler;

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'));
};