let handler = async (m, { usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    if (!user) return m.reply("❌ No estás registrado en el sistema.");

    if (!user.mascota) return m.reply(`❌ No tienes una mascota. Usa *${usedPrefix}tienda* para comprar una.`);

    let { nombre, vida, xp, habilidad } = user.mascota;
    let estado = "🔵 Saludable";
    if (vida < 70) estado = "🟡 Herida";
    if (vida < 30) estado = "🔴 Crítica";

    return m.reply(
        `🐾 *Tu Mascota:*\n` +
        `🔹 Nombre: *${nombre}*\n` +
        `💛 Vida: *${vida}*\n` +
        `🎖️ XP: *${xp}*\n` +
        `🛠️ Habilidad: *${habilidad}*\n` +
        `🩺 Estado: *${estado}*\n\n` +
        `✨ Cuida bien de tu mascota para mejorar su rendimiento en batalla.`
    );
};

handler.command = /^(mascota)$/i;
export default handler;