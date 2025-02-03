
let handler = async (m, { conn }) => {
    const user = m.sender.split('@')[0]; // Obtener el nombre de usuario
    const feoMessage = `_*@.${@user}/⁩* *ES* *%* *FEO,* *MEJOR MÁTATE HERMANO 🤢*_`;
    
    // Enviamos el mensaje al chat
    await conn.sendMessage(m.chat, { text: feoMessage }, { quoted: m });
}

handler.help = ['feo'];
handler.tags = ['diversión'];
handler.command = ['feo'];

export default handler;
