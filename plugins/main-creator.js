
import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn }) { 
    let numcreador = '584146277368';
    let ownerJid = numcreador + '@s.whatsapp.net';

    let name = await conn.getName(ownerJid) || 'Owner'; 
    let about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || 'Creador de bots de WhatsApp y del Bot Barboza Ai';
    let empresa = 'Barboza - Servicios Tecnológicos';
    let imagen = 'https://qu.ax/Mvhfa.jpg'; // Reemplaza con la URL de la imagen que deseas mostrar

    // Enviar imagen con la información del dueño abajo
    await conn.sendMessage(m.chat, { 
        image: { url: imagen },
        caption: `👤 *Dueño del bot*\n\n📌 *Nombre:* ${name}\n📞 *Número:* wa.me/${numcreador}`,
    }, { quoted: m });
}

handler.help = ['owner']; 
handler.tags = ['main']; 
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;