// Código Hecho Por Barboza
let handler = async (m, { conn }) => {
// React con un emoji al mensaje
m.react('⭐');
// Mensaje que se enviará
const message = "*AQUI ESTAN LOS PRECIOS.*\n\n> Bot Para Grupos💫
1 BOT = 3$
2 BOT = 6$  
3 BOT = 9$
4 BOT = 12$
5 BOT = 15$";
if (m.isGroup) {
// URL de la imagen
const imageUrl = 'https://f.uguu.se/dAgiToMl.jpg'; // Cambia esta URL por la de la imagen que deseas enviar
// Envía el mensaje
// Envía la imagen
await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: message }, { mimetype: 'image/jpeg' });
}
}
handler.help = ['precios2'];
handler.tags = ['main'];
handler.group = true;
handler.command = ['precios2', 'p2'];
export default handler;