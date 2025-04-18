
import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn, args }) { 
    let numcreador = '584146277368';
    let ownerJid = numcreador + '@s.whatsapp.net';

    let name = await conn.getName(ownerJid) || 'Owner'; 
    let imagen = 'https://qu.ax/Mvhfa.jpg'; // Reemplaza con la URL de la imagen que deseas usar

    // Formatear el mensaje para enviar directamente
    const mensaje = args.join(" ") || "¡Hola! Este mensaje es enviado por el bot Barboza AI.";

    // Enviar la imagen y el número
    await conn.sendMessage(m.chat, { 
        image: { url: imagen },
        caption: `📞 *Número del dueño:* wa.me/${numcreador}\n\n*Para enviar mensaje:*\n${mensaje}`,
    }, { quoted: m });

    // Enviar el mensaje al dueño (opcional)
    try {
        await conn.sendMessage(ownerJid, { 
            text: `📩 Nuevo mensaje enviado desde el bot:\n${mensaje}`,
        });
        m.reply(`✅ Tu mensaje ha sido enviado al dueño.`);
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        m.reply("❌ Ocurrió un error al enviar el mensaje. Intenta nuevamente.");
    }
}

handler.help = ['owner <mensaje>']; 
handler.tags = ['main']; 
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;