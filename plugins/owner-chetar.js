
const handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    if (!user) {
        console.error("Usuario no encontrado en la base de datos:", m.sender);
        return; // O manejar el error de otra manera
    }

    const username = m.sender.split('@')[0];
    const message = `🚩 *@${username}* Ahora tienes recursos ilimitados`;

    try {
        // Asignar recursos infinitos
        user.money = Infinity;
        user.estrellas = Infinity;
        user.level = Infinity;
        user.exp = Infinity;
        user.dulce = Infinity;

        // Guardar los cambios en la base de datos
        global.db.data.users[m.sender] = user;

        await conn.sendMessage(m.chat, { text: message, mentions: [m.sender] }, { quoted: fkontak });
        console.log(`Recursos cheteados para ${username}`); // Registro para depuración
    } catch (error) {
        console.error("Error al chetear recursos:", error);
        // Manejar el error, por ejemplo, enviar un mensaje de error al usuario o al administrador
    }
};

handler.help = ['cheat'];
handler.tags = ['owner'];
handler.command = /^(ilimitado|infiniy|chetar)$/i;
handler.rowner = true;
handler.fail = null;

export default handler;