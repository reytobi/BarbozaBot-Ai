
let handler = async (m, { conn }) => {
    let users = global.db.data.users;
    let user = users[m.sender];

    // Obtener la fecha actual
    let today = new Date().toDateString();

    // Verificar si el usuario ya reclamó sus dulces hoy
    if (user.lastClaimedDulces === today) {
        return m.reply("🚫 Ya has reclamado tus dulces hoy. Vuelve mañana para recibir más.");
    }

    // Cantidad de dulces a ganar
    let dulcesGanados = 10; // Puedes cambiar esta cantidad

    // Sumar los dulces ganados al usuario
    user.dulces = (user.dulces || 0) + dulcesGanados;

    // Actualizar la fecha de la última reclamación
    user.lastClaimedDulces = today;

    // Respuesta al usuario
    await m.reply(`✅ Has ganado ${dulcesGanados} dulces. Ahora tienes ${user.dulces} dulces.`);
}

handler.help = ['dulcesdiario'];
handler.tags = ['economía'];
handler.command = ['dulcesdiario'];

export default handler;