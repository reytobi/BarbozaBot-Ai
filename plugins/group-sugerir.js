
let handler = async (m, { conn, text }) => {
    if (!text) {
        return conn.sendMessage(m.chat, { text: "Por favor, escribe tu sugerencia después del comando. Ejemplo: .sugerir [tal comando]" }, { quoted: m });
    }

    const suggestion = text; // Capturamos la sugerencia del usuario
    const confirmationMessage = `Gracias por tu sugerencia: "${suggestion}". La tendremos en cuenta. 😊`;

    // Aquí puedes agregar lógica para guardar la sugerencia en una base de datos o archivo si lo deseas

    // Enviamos un mensaje de confirmación al chat
    await conn.sendMessage(m.chat, { text: confirmationMessage }, { quoted: m });
}

handler.help = ['sugerir <tu_sugerencia>'];
handler.tags = ['sugerencias'];
handler.command = ['sugerir'];

export default handler;
