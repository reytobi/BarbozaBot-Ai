// Código Creado Por Barboza 

import fetch from 'node-fetch';
const handler = async (m, {conn, text, usedPrefix, command}) => {
if (!text) throw `*👻 ingrese un texto para generar poder generar su imagen*`;
m.react('🕒');
await conn.sendMessage(m.chat, {text: '*👻 Generando Imagen*'}, {quoted: m});
try {
const response = await fetch(`https://eliasar-yt-api.vercel.app/api/canvas/logo?texto=${encodeURIComponent(text)}&url=${encodeURIComponent(profilePicture)}`);
if (!response.ok) throw new Error('Network response was not ok');
const buffer = await response.buffer();
m.react('✔️');
await conn.sendMessage(m.chat, {image: buffer}, {quoted: m});
} catch (error) {
console.error(error);
throw `*🚨 Lo Sentimos, ha ocurrido un error 😔*`;
}
}
handler.tags = ['tools'];
handler.help = ['genearimg <nombre> <link de la imagen>'];
handler.command = ['genearimg','imgg'];
export default handler;