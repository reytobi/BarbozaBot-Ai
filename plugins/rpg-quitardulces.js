
const handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    if (!user) {
        console.error("Usuario no encontrado en la base de datos:", m.sender);
        return; // Manejo del error si el usuario no existe
    }

    const cantidad = 10; // Cambia este número a la cantidad de dulces que deseas quitar
    if (user.dulce < cantidad) {
        await conn.sendMessage(m.chat, { text: "No tienes suficientes dulces para quitar." }, { quoted: fkontak });
        return;
    }

    user.dulce -= cantidad; // Quitar la cantidad especificada de dulces
    const message = `🚩 *@${m.sender.split('@')[0]}* Se te han quitado ${cantidad} dulces. Ahora tienes ${user.dulce} dulces restantes.`;

    try {
        await conn.sendMessage(m.chat, { text: message, mentions: [m.sender] }, { quoted: fkontak });
        console.log(`Se han quitado ${cantidad} dulces a ${m.sender}`); // Registro para depuración
    } catch (error) {
        console.error("Error al quitar los dulces:", error);
        await conn.sendMessage(m.chat, { text: "Hubo un error al intentar quitar los dulces. Intenta de nuevo más tarde." }, { quoted: fkontak });
    }
};

handler.help = ['quitardulces'];
handler.tags = ['owner'];
handler.command = /^(quitardulces)$/i;
handler.rowner = true; // Solo el dueño puede usar este comando
handler.fail = null;

export default handler;