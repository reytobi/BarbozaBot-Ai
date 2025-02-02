
let handler = async (m) => {
    const usuarioId = m.sender; // ID del usuario que envió el mensaje

    // Mensaje de respuesta con mención al usuario y la frase divertida
    const mensajeRespuesta = `@${usuarioId.split('@')[0]} 🗣️ Eres más mamaguevo que tu padre 😂 *%*`;

    await conn.sendMessage(m.chat, { text: mensajeRespuesta, mentions: [usuarioId] }, { quoted: m });
}

handler.help = ['mamaguevo'];
handler.tags = ['diversión'];
handler.command = ['mamaguevo'];

export default handler;