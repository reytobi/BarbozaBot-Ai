
import fetch from 'node-fetch';

const handler = async (m, { conn, command }) => {
  try {
    // Llamada a la API para obtener un meme
    const apiUrl = 'https://api.vreden.my.id/api/meme';
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Verificar si la API retornó un meme válido
    if (!data?.url) {
      return conn.reply(m.chat, '❌ No se pudo obtener un meme. Inténtalo de nuevo más tarde.', m);
    }

    // Enviar el meme al chat
    await conn.sendMessage(m.chat, {
      image: { url: data.url },
      caption: `🤣 Aquí tienes un meme aleatorio para alegrarte el día!`
    }, { quoted: m });

  } catch (error) {
    console.error('Error al obtener el meme:', error);
    conn.reply(m.chat, `❌ Ocurrió un error al obtener el meme: ${error.message}`, m);
  }
};

handler.command = ['meme', 'memes'];
handler.help = ['meme', 'memes'];
handler.tags = ['fun'];

export default handler;
