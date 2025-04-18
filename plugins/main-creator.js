
import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn }) { 
    let numcreador = '584146277368';
    let ownerJid = numcreador + '@s.whatsapp.net';

    let name = await conn.getName(ownerJid) || 'Owner'; 
    let imagen = 'https://qu.ax/Mvhfa.jpg'; // Reemplaza con la URL de la imagen que deseas usar

    // Enviar solo la imagen y el número debajo
    await conn.sendMessage(m.chat, { 
        image: { url: imagen },
        caption: `📞 ${numcreador}`, // Número mostrado debajo de la imagen
    }, { quoted: m });
}

handler.help = ['owner']; 
handler.tags = ['main']; 
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;