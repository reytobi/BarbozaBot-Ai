import axios from 'axios';
import cheerio from 'cheerio';
import qs from 'qs';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`Ejemplo de uso: *${usedPrefix + command} Joji - Ew*`);
  }

  const appleMusic = {
    search: async (query) => {
      const url = `https://music.apple.com/us/search?term=${query}`;
      try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const results = [];
        $('.desktop-search-page .section[data-testid="section-container"] .grid-item').each((index, element) => {
          const title = $(element).find('.top-search-lockup__primary__title').text().trim();
          const subtitle = $(element).find('.top-search-lockup__secondary').text().trim();
          const link = $(element).find('.click-action').attr('href');
          results.push({ title, subtitle, link });
        });
        return results;
      } catch (error) {
        console.error("Error en búsqueda de Apple Music:", error.message);
        return { success: false, message: error.message };
      }
    }
  };

  const appledown = {
    getData: async (urls) => {
      const url = `https://aaplmusicdownloader.com/api/applesearch.php?url=${urls}`;
      try {
        const response = await axios.get(url, {
          headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'MyApp/1.0',
            'Referer': 'https://aaplmusicdownloader.com/'
          }
        });
        return response.data;
      } catch (error) {
        console.error("Error obteniendo datos de Apple Music Downloader:", error.message);
        return { success: false, message: error.message };
      }
    }
  };

  conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  // Buscar resultados
  const searchResults = await appleMusic.search(text);
  if (!searchResults.length) {
    return m.reply("No se encontraron resultados para tu búsqueda.");
  }

  const musicData = await appledown.getData(searchResults[0].link);
  if (!musicData || !musicData.name) {
    return m.reply("No se pudo obtener la información del audio.");
  }

  // Crear mensaje con información detallada
  const { name, albumname, artist, thumb, duration } = musicData;

  const infoMessage = {
    image: { url: thumb },
    caption: `🎵 *Información del Audio:*\n\n` +
      `📌 *Nombre:* ${name}\n` +
      `💿 *Álbum:* ${albumname}\n` +
      `🎤 *Artista:* ${artist}\n` +
      `⏱️ *Duración:* ${duration}\n`,
    contextInfo: {
      externalAdReply: {
        title: name,
        body: `${artist} • ${albumname}`,
        mediaType: 2,
        mediaUrl: searchResults[0].link,
        thumbnailUrl: thumb,
        showAdAttribution: true
      }
    }
  };

  // Enviar mensaje con detalles
  await conn.sendMessage(m.chat, infoMessage);

  // Obtener enlace de descarga
  const downloadLink = await appledown.download(searchResults[0].link);

  if (!downloadLink.success) {
    return m.reply(`Error: ${downloadLink.message}`);
  }

  const audioMessage = {
    audio: { url: downloadLink.download },
    mimetype: 'audio/mp4',
    fileName: `${name}.mp3`,
    contextInfo: {
      externalAdReply: {
        title: name,
        body: `${artist} • ${albumname}`,
        mediaType: 2,
        mediaUrl: searchResults[0].link,
        thumbnailUrl: thumb,
        showAdAttribution: true
      }
    }
  };

  // Enviar audio
  await conn.sendMessage(m.chat, audioMessage, { quoted: m });
  await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.limit = 3;
handler.command = /^(applemusicplay|play|song)$/i;

export default handler;