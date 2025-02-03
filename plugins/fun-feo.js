
import fs from 'fs';

// Leer el archivo .feo
const feoMessage = fs.readFileSync('mensaje.feo', 'utf-8').trim();

// Handler para enviar el mensaje
let handler = async (m, { conn }) => {
    // Enviamos el mensaje al chat
    await conn.sendMessage(m.chat, { text: feoMessage }, { quoted: m });
}

handler.help = ['feo'];
handler.tags = ['diversión'];
handler.command = ['feo'];

export default handler;
