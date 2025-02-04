
let handler = async (m, { conn, text }) => {
    // Verificar si se ha proporcionado un usuario
    if (!text) {
        return conn.sendMessage(m.chat, { text: "Por favor, menciona a un usuario. Ejemplo: .carta2 @usuario" }, { quoted: m });
    }

    let user = text.replace(/[^0-9]/g, ''); // Extraer el ID del usuario mencionado
    let cartaMessage = `🌹✨ *De Sebastián para @⁨${user}/⁩* ✨🌹\n\nQuerido/a @⁨${user}/⁩,\n\nEres la luz que ilumina mis días y la razón detrás de mis sonrisas. Cada momento contigo es un regalo que atesoro en mi corazón. Espero que siempre sientas lo especial que eres para mí.\n\nCon todo mi cariño,\nSebastián 💖`;

    // Enviamos el mensaje al chat
    await conn.sendMessage(m.chat, { text: cartaMessage }, { quoted: m });
}

handler.help = ['carta2 @usuario'];
handler.tags = ['amor'];
handler.command = ['carta2'];

export default handler;