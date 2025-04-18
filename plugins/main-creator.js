
import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
   await m.react('🎩');

   let numcreador = '584146277368';
   let ownerJid = numcreador + '@s.whatsapp.net';
   let name = await conn.getName(ownerJid) || 'Owner';
   let empresa = 'Barboza - Servicios Tecnológicos';
   let imagen = 'https://qu.ax/Mvhfa.jpg'; // URL de la imagen del creador

   // Enviar solo la imagen con el número debajo
   await conn.sendMessage(m.chat, { 
       image: { url: imagen },
       caption: `📞 ${numcreador}`,
   }, { quoted: m });
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = /^(owner|creator|creador|dueño)$/i;

export default handler;