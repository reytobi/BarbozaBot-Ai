
let handler = async (m, { conn }) => {
    let menu5 = `
🌟 *Menú 5* 🌟
`Bienvenido al mundo de las mascotas 🐇`

1. `Consigue tu mascota con .comprar. Pero antes de eso, tienes que conseguir dulces con .claim, .w y .minar.`

2. `Usa .mimascota para ver el estado de tu mascota.`

3. `Usa .comprarcomida para comprar comida para tu mascota y alimentarla.`

4. `Usa .alimentar para alimentar a tu mascota.`

5. `Usa .cotos para ver el costo de cada mascota.`

6.excavar pon a tu mascota a excavar

7.`Importante: Para poder hacer todo eso, tienes que conseguir dulces con los comandos: .claim, .crimen, .w, .trabajar, .buy y minar.`

    `.trim();

    await conn.sendMessage(m.chat, { text: menu5 }, { quoted: m });
}

handler.help = ['menu5'];
handler.tags = ['menú'];
handler.command = ['menu5'];

export default handler;