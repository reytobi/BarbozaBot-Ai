
let handler = async (m, { conn }) => {
    const imageUrl = 'https://i.ibb.co/mC5rt4k9/file.jpg'; // Reemplaza esto con la URL de tu imagen
    await conn.sendMessage(m.chat, { image: { url: imageUrl } }, { quoted: m });
}

handler.help = ['octavoschampions'];
handler.tags = ['info'];
handler.command = ['octavoschampions'];

export default handler;
