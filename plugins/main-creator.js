
import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
   await m.react('🎩');

   let numcreador = '584146277368';
   let ownerJid = numcreador + '@s.whatsapp.net';
   let name = await conn.getName(ownerJid) || 'Owner';
   let empresa = 'Barboza - Servicios Tecnológicos';
   let about = 'Creador de bots de WhatsApp y del Bot Barboza Ai';
   let imagen = 'https://qu.ax/Mvhfa.jpg'; // URL de la imagen del creador

   // VCARD con información de contacto
   let list = [{
       displayName: name,
       vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nORG:${empresa}\nTITLE:CEO & Fundador\nTEL;waid=${numcreador}:${numcreador}\nEMAIL:sebastianbarbaro82@gmail.com\nURL:https://www.instagram.com/sebastian_barboza13\nNOTE:${about}\nEND:VCARD`,
   }];

   // Enviar el contacto con los detalles
   await conn.sendMessage(m.chat, {
       contacts: {
           displayName: `${list.length} Contacto`,
           contacts: list
       },
       contextInfo: {
           externalAdReply: {
               showAdAttribution: true,
               title: 'Dueño del Bot - Barboza AI',
               body: empresa,
               thumbnailUrl: imagen,
               sourceUrl: 'https://www.instagram.com/sebastian_barboza13',
               mediaType: 1,
               renderLargerThumbnail: true
           }
       }
   }, {
       quoted: m
   });

   // Mensaje de texto con la imagen y el número del dueño
   await conn.sendMessage(m.chat, { 
       image: { url: imagen },
       caption: `📞 ${numcreador}`,
   }, { quoted: m });
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = /^(owner|creator|creador|dueño)$/i;

export default handler;