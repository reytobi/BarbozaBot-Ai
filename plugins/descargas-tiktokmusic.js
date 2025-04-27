
import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '❌ Por favor, proporciona un enlace válido de TikTok.\nEjemplo: .tiktokmusic https://vt.tiktok.com/ZSr6HXMxk/', m);
  }

  const url = args[0];
  const apiUrl = `https://api.vreden.my.id/api/tikmusic?url=${encodeURIComponent(url)}`;

  try {
    await m.react('⏳'); // Reacción de "procesando"

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.result || !data.result.audio) {
      return conn.reply(m.chat, '❌ No se pudo obtener la música del enlace proporcionado. Verifica que el enlace sea válido.', m);
    }

    const audioUrl = data.result.audio;

    // Enviar el audio al usuario
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      fileName: 'tiktok_music.mp3',
    }, { quoted: m });

    await m.react('✅'); // Reacción de éxito
  } catch (error) {
    console.error('Error al procesar el enlace de TikTok:', error);
    await m.react('❌'); // Reacción de error
    conn.reply(m.chat, `❌ Ocurrió un error al procesar el enlace: ${error.message}`, m);
  }
};

handler.command = ['tiktokmusic'];
handler.help = ['tiktokmusic <enlace>'];
handler.tags = ['downloader'];

export default handler;