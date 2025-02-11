
let handler = async (m) => {
    const memes = [
        'https://qu.ax/DksQt.mp4',
        'https://qu.ax/vDgQd.mp4',
        'https://qu.ax/jpiBe.mp4',
        'https://qu.ax/TiecS.mp4',
        'https://qu.ax/LWJCF.mp4',
        'https://qu.ax/euTXj.mp4',
        'https://qu.ax/GoOJh.mp4',
        // Agrega más enlaces de memes aquí
    ];

    // Elegir un meme aleatorio
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];

    // Enviar el meme al chat
    await conn.sendMessage(m.chat, { video: { url: randomMeme }, caption: "¡Aquí tienes un meme para disfrutar!" }, { quoted: m });
}

handler.help = ['mp4meme'];
handler.tags = ['diversión'];
handler.command = ['mp4meme'];

export default handler;