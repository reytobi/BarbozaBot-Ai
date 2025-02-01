
let handler = async (m, { conn }) => {
    let users = global.db.data.users;

    // Generar recompensas aleatorias
    let dulces = Math.floor(Math.random() * 100) + 1; // entre 1 y 100 dulces
    let monedas = Math.floor(Math.random() * 50) + 1; // entre 1 y 50 monedas
    let experiencia = Math.floor(Math.random() * 200) + 1; // entre 1 y 200 puntos de experiencia

    // Sumar recompensas al usuario
    users[m.sender].dulces += dulces;
    users[m.sender].monedas += monedas;
    users[m.sender].exp += experiencia;

    // Respuesta al usuario
    await m.reply(`🎉 ¡Has abierto un cofre! 🎁\n\n- *Dulces:* +${dulces}\n- *Monedas:* +${monedas}\n- *Experiencia:* +${experiencia}`);
}

handler.help = ['abrirCofre'];
handler.tags = ['economía'];
handler.command = ['abrirCofre'];

export default handler;