
let handler = async (m, { conn, args }) => {
    // Verifica que el usuario ha proporcionado una cantidad de dulces
    if (!args[0] || isNaN(args[0])) {
        return m.reply("Por favor, especifica la cantidad de dulces que deseas apostar.");
    }

    let apuesta = parseInt(args[0]);

    // Verifica si el usuario tiene suficientes dulces
    let userDulces = global.db.data.users[m.sender].dulces || 0; // Cambia esto según cómo almacenes los dulces
    if (userDulces < apuesta) {
        return m.reply(`No tienes suficientes dulces. Tienes ${userDulces} dulces.`);
    }

    // Resta los dulces apostados del usuario
    global.db.data.users[m.sender].dulces -= apuesta;

    // Selecciona aleatoriamente un ganador (puedes modificar esta lógica)
    let participantes = [m.sender]; // Podrías agregar más participantes si deseas
    let ganador = participantes[Math.floor(Math.random() * participantes.length)];

    // Si el ganador es el mismo que apostó, no puede ganar
    while (ganador === m.sender) {
        ganador = participantes[Math.floor(Math.random() * participantes.length)];
    }

    // El ganador recibe los dulces apostados
    global.db.data.users[ganador].dulces += apuesta;

    // Mensaje de resultado
    await conn.sendMessage(m.chat, {
        text: `🎉 ¡Felicidades! ${ganador} ha ganado ${apuesta} dulces. 🎉`
    }, { quoted: m });
};

handler.help = ['apostardulces <cantidad>'];
handler.tags = ['juegos'];
handler.command = ['apostardulces'];

export default handler;