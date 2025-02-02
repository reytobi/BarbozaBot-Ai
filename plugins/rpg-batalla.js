
let handler = async (m, { conn }) => {
    // Simulamos las estadísticas de las mascotas
    let mascota1 = {
        nombre: "Mascota A",
        vida: Math.floor(Math.random() * 100) + 50, // Vida entre 50 y 150
        ataque: Math.floor(Math.random() * 20) + 10 // Ataque entre 10 y 30
    };

    let mascota2 = {
        nombre: "Mascota B",
        vida: Math.floor(Math.random() * 100) + 50, // Vida entre 50 y 150
        ataque: Math.floor(Math.random() * 20) + 10 // Ataque entre 10 y 30
    };

    // Simulamos la batalla
    while (mascota1.vida > 0 && mascota2.vida > 0) {
        mascota1.vida -= mascota2.ataque;
        mascota2.vida -= mascota1.ataque;
    }

    // Determinamos el ganador
    let mensajeFinal;
    if (mascota1.vida <= 0 && mascota2.vida <= 0) {
        mensajeFinal = `¡Empate! Ambas mascotas han caído en la batalla. 💔`;
    } else if (mascota1.vida <= 0) {
        mensajeFinal = `¡${mascota2.nombre} ha ganado la batalla! 🎉`;
    } else {
        mensajeFinal = `¡${mascota1.nombre} ha ganado la batalla! 🎉`;
    }

    // Mensaje con las estadísticas finales
    mensajeFinal += `\n\nEstadísticas Finales:\n${mascota1.nombre} - Vida: ${Math.max(mascota1.vida, 0)}\n${mascota2.nombre} - Vida: ${Math.max(mascota2.vida, 0)}`;

    // Enviamos el mensaje al chat
    await conn.sendMessage(m.chat, { text: mensajeFinal }, { quoted: m });
}

handler.help = ['batalla1'];
handler.tags = ['mascotas'];
handler.command = ['batalla1'];

export default handler;