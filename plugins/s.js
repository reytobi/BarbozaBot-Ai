
let handler = async (m) => {
    const memes = [
        'https://i.imgur.com/1.jpg', // Reemplaza con enlaces a tus memes
        'https://i.imgur.com/2.jpg',
        'https://i.imgur.com/3.jpg',
        'https://i.imgur.com/4.jpg',
        'https://i.imgur.com/5.jpg'
    ];

    // Elegir un meme aleatorio
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];

    // Enviar el meme al chat
    await conn.sendMessage(m.chat, { image: { url: randomMeme }, caption: "¡Aquí tienes un meme para alegrar tu día! 😂" }, { quoted: m });
}

handler.help = ['meme'];
handler.tags = ['diversión'];
handler.command = ['meme'];

export default handler;