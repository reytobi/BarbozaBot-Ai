
import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '❌ Por favor, ingresa el nombre de una canción de Spotify.\nEjemplo: .spotify Shape of You', m);
  }

  const query = args.join(' ');
  const apiUrl = `https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(query)}`;

  try {
    await m.react('⏳'); // Reacción de "procesando"

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

    const data = await response.json();
    if (!data || !data.result) {
      return conn.reply(m.chat, '❌ No se encontró información sobre la canción proporcionada.', m);
    }

    const { title, artist, duration, downloadUrl } = data.result;

    // Validación de datos individuales
    const songTitle = title || 'Título no disponible';
    const songArtist = artist || 'Artista no disponible';
    const songDuration = duration || 'Duración no disponible';
    const songLink = downloadUrl || 'Enlace no disponible';

    const songInfo = `🎵 *Información de la Canción*\n\n
    ➤ 🎶 Título: ${songTitle}
    ➤ 👤 Artista: ${songArtist}
    ➤ ⏳ Duración: ${songDuration}
    ➤ 🔗 [Escuchar y Descargar](${songLink})`;

    await conn.reply(m.chat, songInfo.trim(), m);

    // Envía el archivo de audio como mensaje
    if (downloadUrl) {
      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${songTitle}.mp3`,
      }, { quoted: m });
    }

    await m.react('✅'); // Reacción de éxito
  } catch (error) {
    console.error('Error al obtener información de Spotify:', error);
    await m.react('❌'); // Reacción de error
    conn.reply(m.chat, `❌ Ocurrió un error: ${error.message}`, m);
  }
};

handler.command = ['spotify'];
handler.help = ['spotify <nombre de la canción>'];
handler.tags = ['music', 'descargas'];

export default handler;