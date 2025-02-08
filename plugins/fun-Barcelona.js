
var handler = async (m) => {
    // Creamos el mensaje para el comando .barcelona
    let barcelonaMessage = `
━━━━━━━━━━━━━━━
❤️💙 *Visca Barsa, Visca Cataluña!* ❤️💙
━━━━━━━━━━━━━━━
`.trim();

    // Enviamos la respuesta
    m.reply(barcelonaMessage);
}

handler.help = ['barcelona']
handler.tags = ['fun']
handler.command = /^(barcelona)$/i

export default handler;