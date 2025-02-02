
let handler = async (m, { conn, args }) => {
    // Verificar si se menciona a un usuario
    if (!args[0]) {
        return conn.sendMessage(m.chat, { text: "⚠️ Debes mencionar a un usuario. Usa el formato: .peruano @usuario" }, { quoted: m });
    }

    // Obtener el ID del usuario mencionado
    let userMentioned = m.mentionedJid[0];
    
    // Mensaje que se enviará
    const mensaje = `💫 *CALCULADORA*\n\n🤮 Los cálculos han arrojado que @${userMentioned.split('@')[0]} es *251%* peruano 🇵🇪\n> ✰ Despegala De Aqui Cacorro!`;

    // Enviar el mensaje al chat
    await conn.sendMessage(m.chat, { text: mensaje.replace('@', '') }, { quoted: m });
}
handler.help = ['peruano @usuario'];
handler.tags = ['diversión'];
handler.command = ['peruano'];

export default handler;