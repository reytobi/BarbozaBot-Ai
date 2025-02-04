
let handler = async (m, { conn, text }) => {
    // Verificar si se ha proporcionado un usuario
    if (!text) {
        return conn.sendMessage(m.chat, { text: "Por favor, menciona a un usuario. Ejemplo: .carta2 @usuario" }, { quoted: m });
    }

    let userMentioned = text.replace(/[^0-9]/g, ''); // Extraer el ID del usuario mencionado
    let userSender = m.sender.split('@')[0]; // Obtener el nombre del usuario que envía el mensaje
    let cartaMessage = `🌹✨ *De @⁨${userSender}/⁩ para @⁨${userMentioned}/⁩* ✨🌹\n\nQuerido/a @⁨${userMentioned}/⁩,\n\nEres la razón de mi felicidad y cada día contigo es un nuevo capítulo lleno de amor. Espero que siempre sientas lo especial que eres para mí. Gracias por ser tú.\n\nCon todo mi cariño,\n@⁨${userSender}/⁩ 💖`;

    // Enviamos el mensaje al chat
    await conn.sendMessage(m.chat, { text: cartaMessage }, { quoted: m });
}

handler.help = ['carta2 @usuario'];
handler.tags = ['amor'];
handler.command = ['carta2'];

export default handler;
