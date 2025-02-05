
let handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    const now = new Date();

    // Verifica si el usuario puede abrir el cofre
    if (user.lastCofreSema && now - user.lastCofreSema < 3600000) { // 1 hora en milisegundos
        const timeLeft = Math.ceil((3600000 - (now - user.lastCofreSema)) / 60000); // Tiempo restante en minutos
        return conn.reply(m.chat, `⏳ Debes esperar ${timeLeft} minutos antes de abrir otro cofre.`, m);
    }

    // Actualiza la última vez que se abrió el cofre
    user.lastCofreSema = now;

    // Añade las recompensas
    const recompensaDulces = 20;
    const recompensaXP = 20;

    user.sweets += recompensaDulces;
    user.xp += recompensaXP;

    conn.reply(m.chat, `🎉 ¡Has abierto el cofre y recibiste ${recompensaDulces} dulces y ${recompensaXP} XP! 🎉 Ahora tienes ${user.sweets} dulces y ${user.xp} XP en total.`, m);
};

handler.help = ['cofresema'];
handler.tags = ['economy'];
handler.command = ['cofresema'];

export default handler;