import fetch from 'node-fetch';
const handler = async (m, {conn, text, usedPrefix, command}) => {
// Verificamos que el usuario haya ingresado un texto
if (!text) throw `* Introdusca un texto para generar tu imagen a tu gusto*`;
// Mostramos un emoji de reloj mientras generamos la imagen
m.react('🕒');
await conn.sendMessage(m.chat, {text: '*🧑‍💻 Estamos trabajando en su pedido pronto se realizara*'}, {quoted: m});
try {
// Hacemos la solicitud a la API con el texto proporcionado
const response = await fetch(`https://archive-ui.tanakadomp.biz.id/maker/text2img?text=${encodeURIComponent(text)}`);
// Verificamos si la respuesta fue exitosa
if (!response.ok) throw new Error('Network response was not ok');
// Obtenemos el buffer de la imagen
const buffer = await response.buffer();
// Mostramos un emoji de éxito
m.react('✔️');
// Enviamos la imagen generada al chat
await conn.sendMessage(m.chat, {image: buffer}, {quoted: m});
} catch (error) {
console.error(error);
throw `*🚨 Error inesperado*`;
}
}
// Definimos las etiquetas y comandos para el handler
handler.tags = ['tools'];
handler.help = ['genearimg'];
handler.command = [''geneimg, 'imgg'];
// Exportamos el handler
export default handler;