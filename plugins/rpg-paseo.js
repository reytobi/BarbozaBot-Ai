
let handler = async (m, { conn }) => {
    // Simulamos un paseo
    let resultados = [
        { mensaje: "Tu mascota está disfrutando del paseo y ha encontrado un nuevo amigo. 🐕❤️", dulces: 5, experiencia: 10 },
        { mensaje: "¡El paseo fue increíble! Tu mascota corrió y encontró un frisbee. 🥏🐾", dulces: 3, experiencia: 8 },
        { mensaje: "Tu mascota se está divirtiendo mucho, ¡pero ha decidido parar a olfatear todo! 🐶👃", dulces: 2, experiencia: 5 },
        { mensaje: "El paseo fue tranquilo, ¡tu mascota se comportó como un angelito! 😇🐕", dulces: 4, experiencia: 7 },
        { mensaje: "¡Oh no! Tu mascota vio una ardilla y salió corriendo tras ella. 🐿️🏃‍♂️", dulces: 1, experiencia: 3 }
    ];

    // Elegimos un resultado aleatorio
    let resultado = resultados[Math.floor(Math.random() * resultados.length)];

    // Mensaje final con dulces y experiencia ganada
    let mensajeFinal = `${resultado.mensaje}\nHas ganado ${resultado.dulces} dulces y ${resultado.experiencia} puntos de experiencia. 🎉`;

    // Enviamos el mensaje al chat
    await conn.sendMessage(m.chat, { text: mensajeFinal }, { quoted: m });
}

handler.help = ['paseo'];
handler.tags = ['mascotas'];
handler.command = ['paseo'];

export default handler;