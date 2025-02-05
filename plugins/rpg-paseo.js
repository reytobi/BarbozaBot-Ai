
let handler = async (m) => {
    let user = global.db.data.users[m.sender];

    // Simular el paseo
    await m.reply(`${user.nombre}, ¡estás paseando a tu mascota! 🐾`);

    // Dar la recompensa
    user.dulces += 50; // Aumentar los dulces en 50
    user.exp += 50; // Aumentar la experiencia en 50

    await m.reply(`🎉 ¡Felicidades! Has recibido *50 dulces* y *50 EXP* por pasear a tu mascota.`);
}

handler.help = ['pasear']
handler.tags = ['mascota']
handler.command = ['walk', 'paseo']
handler.register = true 
export default handler;