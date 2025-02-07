let handler = async (m, { command }) => {
    let user = global.db.data.users[m.sender];
    if (!user) return m.reply("❌ No estás registrado en el sistema.");

    // Eliminar datos del usuario
    user.diamantes = 0;
    user.dulces = 0;
    user.xp = 0;
    user.mascota = null; // Borra la mascota

    return m.reply("🗑️ *Se han eliminado tus datos:*\n💎 Diamantes: 0\n🍬 Dulces: 0\n🎖️ XP: 0\n🐾 Mascota: Ninguna");
};

handler.command = /^delete$/i;
export default handler;