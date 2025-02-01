
let handler = async (m, { conn }) => {
    // Simulamos una excavación
    let resultados = [
        "¡Has encontrado 5 dulces! 🍬",
        "¡Has encontrado una piedra preciosa! 💎",
        "¡No has encontrado nada! 😢",
        "¡Has encontrado 10 dulces! 🍬",
        "¡Has encontrado un juguete para tu mascota! 🧸"
    ];

    // Elegimos un resultado aleatorio
    let resultado = resultados[Math.floor(Math.random() * resultados.length)];

    // Enviamos el mensaje al chat
    await conn.sendMessage(m.chat, { text: resultado }, { quoted: m });
}

handler.help = ['excavar'];
handler.tags = ['mascotas'];
handler.command = ['excavar'];

export default handler;