
import db from '../lib/database.js';

let handler = async (m, { conn }) => {
    let users = global.db.data.users;
    let user = users[m.sender];

    // Número de teléfono del owner
    const ownerNumber = '+584246582666';

    // Verificar si el que ejecuta el comando es el owner
    if (m.sender !== ownerNumber) {
        return await m.reply('🚫 Solo el dueño del bot puede usar este comando.');
    }

    // Verificar si el usuario ya existe en la base de datos
    if (!user) {
        // Inicializar los valores del usuario si no existe
        user = {
            experience: 0,
            dulces: 0
        };
        users[m.sender] = user; // Guardar el nuevo usuario en la base de datos
    }

    // Asignar dulces y experiencia infinitos al owner
    user.experience = Infinity; // Establece XP infinito
    user.dulces = Infinity; // Establece dulces infinitos

    // Respuesta al owner
    await m.reply('🎉 ¡Felicidades! Has recibido XP y dulces infinitos. ¡Ahora puedes regalar a quien quieras!');
};

handler.help = ['chetar'];
handler.tags = ['rpg'];
handler.command = ['chetar'];

export default handler;