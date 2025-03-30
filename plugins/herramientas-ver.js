
import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = q.mimetype || ''; // Asegúrate de usar q.mimetype directamente
    if (!mime) throw '❌ No se detectó un archivo válido';

    const media = await q.download();
    try {
        const isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
        const link = await (isTele ? uploadImage : uploadFile)(media);
        await conn.sendFile(m.chat, link, '', '© Prohibido la copia, Código Oficial de MediaHub™', m);
    } catch (e) {
        console.log(e);
        await conn.reply(m.chat, '❌ Ocurrió un error al procesar el archivo.', m);
    }
}

handler.help = ['ver'];
handler.tags = ['herramientas'];
handler.command = /^(ver)$/i;
export default handler;