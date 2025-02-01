let handler = async (m, { conn }) => {
    let menu5 = `
🌟 *Menú 5* 🌟
`Bienvenido al mundo de las mascotas 🐇`

`1 Consigue tu mascota con . comprar y la mascota Pero ante de eso tiene que conseguir dulces con .claim .w y . minar`

`2 . mimascota para ver el estado de tu mascota`

`3 .comprarcomida compra comida para tu mascota y alimentarla`

`4 .alimentar alimenta a tu mascota` 

`5.cotos para ver el costo de cada mascota`

`6 Importante para poder todo eso tenés que conseguir dulces con los comandos.claim .crimen.w .trabajar .Buy y minar`

Para más información, utiliza el comando correspondiente.
    `.trim();

    await conn.sendMessage(m.chat, { text: menu5 }, { quoted: m });
}

handler.help = ['menu5'];
handler.tags = ['menú'];
handler.command = ['menu5'];

export default handler;