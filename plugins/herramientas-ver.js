
import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    
    if (!q || !q.mimetype) throw '❌ No se detectó un archivo válido'; // Verifica si hay un archivo

    const media = await q.download();
    
    try {
        const mime = q.mimetype; // Asegúrate de usar q.mimetype directamente
        const isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
        
        if (!isTele) throw '❌ Tipo de archivo no soportado'; // Verifica el tipo de archivo

        const link = await (isTele ? uploadImage : uploadFile)(media);
        await conn.sendFile(m.chat, link, '', '© Prohibido la copia, Código Oficial de MediaHub™', m);
    } catch (e) {
        console.error('Error al procesar el archivo:', e); // Mejora en la depuración
        await conn.reply(m.chat, '❌ Ocurrió un error al procesar el archivo.', m);
    }
}

handler.help = ['ver'];
handler.tags = ['herramientas'];
handler.command = /^(ver)$/i;
export default handler;