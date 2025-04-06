import fetch from 'node-fetch';
const handler = async (m, {conn, text, usedPrefix, command}) => {
if (!text) throw `*🧑‍💻 Introdusca un texto para generar tu imagen a tu gusto*`;
m.react('🕒');
await conn.sendMessage(m.chat, {text: '*🧑‍💻 Estamos trabajando en su pedido pronto se realizara*'}, {quoted: m});
try {
const response = await fetch(`https://archive-ui.tanakadomp.biz.id/maker/text2img?text=${encodeURIComponent(text)}`);
if (!response.ok) throw new Error('Network response was not ok');
const buffer = await response.buffer();
m.react('✔️');
await conn.sendMessage(m.chat, {image: buffer}, {quoted: m});
} catch (error) {
console.error(error);
throw `*🚨 Error inesperado*`;
}
handler.tags = ['tools'];
handler.help = ['genearimg'];
handler.command = [''geneimg, 'imgg'];
export default handler;