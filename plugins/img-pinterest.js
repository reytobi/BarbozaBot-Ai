
import fetch from "node-fetch";

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  try {
    if (args[0]?.startsWith("http")) {
      // API para descargar contenido de Pinterest
      let res = await fetch(`https://api.sylphy.xyz/download/pinterest?url=${args[0]}&apikey=sylph`);
      let i = await res.json();

      if (!i?.data?.download) {
        throw new Error("No se pudo obtener el enlace de descarga.");
      }

      let isVideo = i.data.download.includes(".mp4");
      let messageType = isVideo ? "video" : "image";

      await conn.sendMessage(
        m.chat,
        { [messageType]: { url: i.data.download }, caption: i.data.title || "Contenido descargado de Pinterest" },
        { quoted: m }
      );

      await m.react("☑️");
    } else if (text) {
      // API para buscar contenido en Pinterest
      await m.react("🕒"); // Reacción indicando que está buscando

      let res = await fetch(`https://api.sylphy.xyz/search/pinterest?q=${encodeURIComponent(text)}&apikey=sylph`);
      let searchResults = await res.json();

      if (!searchResults?.data || searchResults.data.length === 0) {
        throw new Error("No se encontraron resultados.");
      }

      // Procesar y mostrar los primeros resultados, validando datos
      let message = `🔍 *Resultados para:* ${text}\n\n`;
      searchResults.data.slice(0, 5).forEach((result, index) => {
        const title = result.title || "Sin título"; // Validar título
        const url = result.url || "No disponible"; // Validar enlace
        message += `*${index + 1}.* ${title}\n${url}\n\n`;
      });

      await conn.sendMessage(
        m.chat,
        { text: message.trim(), mentions: [m.sender] },
        { quoted: m }
      );

      await m.react("☑️");
    } else {
      throw new Error(`Uso incorrecto del comando. Intenta usarlo así:\n\n*${usedPrefix + command} <url|texto>*`);
    }
  } catch (err) {
    console.error(err);
    await conn.sendMessage(
      m.chat,
      { text: `❌ Ocurrió un error:\n${err.message}` },
      { quoted: m }
    );
  }
};

handler.command = ["pinterest", "pinsearch"];
export default handler;