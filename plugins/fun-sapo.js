
var handler = async (m, { conn }) => {
    // Obtenemos el ID del usuario que envía el mensaje
    let user = m.sender;

    // Generamos un porcentaje aleatorio de sapo entre 0 y 100
    let sapoPercentage = Math.floor(Math.random() * 101);

    // Creamos el mensaje mencionando al usuario y mostrando el porcentaje
    let sapoMessage = `
━━━━━━━━━━━━━━━
🐸 *${conn.getName(user)}*, eres un ${sapoPercentage}% sapo! 
━━━━━━━━━━━━━━━
`.trim();

    // Enviamos la respuesta mencionando al usuario
    m.reply(sapoMessage, null, { mentions: [user] });
}

handler.help = ['sapo']
handler.tags = ['fun']
handler.command = /^(sapo)$/i

export default handler;