
const handler = async (m, { conn, args }) => {
    const user = global.db.data.users[m.sender];
    if (!user) {
        console.error("Usuario no encontrado en la base de datos:", m.sender);
        return; // Manejo del error si el usuario no existe
    }

    if (!args[0]) {
        return conn.sendMessage(m.chat, { text: "Por favor indica la cantidad de dulces a quitar." }, { quoted: m });
    }

    const cantidad = parseInt(args[0]);
    if (isNaN(cantidad) || cantidad <= 0) {
        return conn.sendMessage(m.chat, { text: "La cantidad debe ser un número positivo." }, { quoted: m });
    }

    const usuarioID = args[1]; // ID del usuario al que le quieres quitar los dulces
    const targetUser = global.db.data.users[usuarioID];
    
    if (!targetUser) {
        return conn.sendMessage(m.chat, { text: "El usuario especificado no se encontró." }, { quoted: m });
    }

    if (targetUser.dulce < cantidad) {
        return conn.sendMessage(m.chat, { text: "El usuario no tiene suficientes dulces para quitar." }, { quoted: m });
    }

    targetUser.dulce -= cantidad; // Quitar la cantidad especificada de dulces
    const message = `🚩 Se le han quitado ${cantidad} dulces a *@${usuarioID.split('@')[0]}*. Ahora tiene ${targetUser.dulce} dulces restantes.`;

    try {
        await conn.sendMessage(m.chat, { text: message, mentions: [usuarioID] }, { quoted: m });
        console.log(`Se han quitado ${cantidad} dulces a ${usuarioID}`); // Registro para depuración
    } catch (error) {
        console.error("Error al quitar los dulces:", error);
        await conn.sendMessage(m.chat, { text: "Hubo un error al intentar quitar los dulces. Intenta de nuevo más tarde." }, { quoted: m });
    }
};

handler.help = ['quitardulces <cantidad> <@usuario>'];
handler.tags = ['admin'];
handler.command = /^(quitardulces)$/i;
handler.admin = true; // Solo los administradores pueden usar este comando
handler.fail = null;

export default handler;