
import db from '../lib/database.js'

let handler = async (m, { conn }) => {
    let users = global.db.data.users;
    let user = users[m.sender];

    // Define la cantidad de experiencia que se ganará
    let experienciaGanada = 100; // Puedes cambiar este valor

    // Aumenta la experiencia del usuario
    user.experience += experienciaGanada;

    // Respuesta al usuario
    await m.reply(`🎉 Has ganado *${experienciaGanada}* puntos de experiencia! Ahora tienes *${user.experience}* puntos de experiencia.`);
}

handler.help = ['claim2'];
handler.tags = ['rpg'];
handler.command = ['claim2'];

export default handler;