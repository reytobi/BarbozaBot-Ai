ñ
let handler = async (m, { conn }) => {
   // URL de la imagen que quieres enviar (reemplaza esto con la URL de tu imagen)
   const imageUrl = 'https://qu.ax/LJEVX.jpg';

   // Mensaje que se enviará junto con la imagen
   const message = "Bot Barboza - Ai se salió, fue genial estar aquí!!";

   // Envía la imagen y el mensaje
   await conn.sendButton(m.chat, message, null, [{ buttonId: 'menu', buttonText: { displayText: 'Volver al menú' }, type: 1 }], m);
   await conn.sendImage(m.chat, imageUrl, message, m);
}

handler.help = ['salir'];
handler.tags = ['general'];
handler.command = ['salir'];
handler.register = true;
export default handler;