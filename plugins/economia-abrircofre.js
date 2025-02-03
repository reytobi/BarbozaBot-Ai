
let handler = async (m, { conn }) => {
    const userId = m.sender; // ID del usuario que usa el comando

    // Obtener la fecha actual
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    // Verificar si el usuario ya ha abierto el cofre hoy
    let lastOpened = global.db.data.users[userId]?.lastOpenedCofre;

    if (lastOpened === today) {
        return conn.sendMessage(m.chat, { text: "⚠️ Ya has abierto tu cofre hoy. ¡Vuelve mañana!" }, { quoted: m });
    }

    // Otorgar los premios
    global.db.data.users[userId].exp += 500; // Añadir experiencia
    global.db.data.users[userId].dulce += 50; // Añadir dulces
    global.db.data.users[userId].monedas += 100; // Añadir monedas

    // Actualizar la fecha de apertura del cofre
    global.db.data.users[userId].lastOpenedCofre = today;

    // Mensaje de éxito
    const mensaje = `🎉 ¡Has abierto el cofre! 🎉\n\n- *Experiencia:* +500\n- *Dulces:* +50\n- *Monedas:* +100`;

    await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m });
}

handler.help = ['abrircofre'];
handler.tags = ['economía'];
handler.command = ['abrircofre'];

export default handler;