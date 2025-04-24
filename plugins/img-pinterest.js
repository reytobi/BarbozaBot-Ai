
import fetch from "node-fetch";

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  try {
    // Verificar si se proporciona una URL válida
    if (args[0]?.startsWith("http")) {
      // Llamada a la API para descargar contenido de Pinterest
      const apiUrl = `https://api.sylphy.xyz/download/pinterest?url=${args[0]}&apikey=sylph`;
      const response = await fetch(apiUrl);
      const result = await response.json();

      // Validar la respuesta de la API
      if (!result?.data?.download) {
        throw new Error("No se pudo obtener el enlace de descarga.");
      }

      // Verificar el tipo de contenido (imagen o video)
      const isVideo = result.data.download.includes(".mp4");
      const messageType = isVideo ? "video" : "image";

      // Enviar contenido al chat
      await conn.sendMessage(
        m.chat,
        {
          [messageType]: { url: result.data.download }, // URL de la imagen o video
          caption: result.data.title || "Contenido descargado de Pinterest",
        },
        { quoted: m }
      );

      // Reacción indicando éxito
      await m.react("☑️");
    } else if (text) {
      // Llamada a la API para buscar contenido en Pinterest
      await m.react("🕒"); // Reacción indicando que está buscando

      const searchApiUrl = `https://api.sylphy.xyz/search/pinterest?q=${encodeURIComponent(text)}&apikey=sylph`;
      const searchResponse = await fetch(searchApiUrl);
      const searchResults = await searchResponse.json();

      // Validar resultados de búsqueda
      if (!searchResults?.data || searchResults.data.length === 0) {
        throw new Error("No se encontraron resultados.");
      }

      // Procesar los resultados y mostrar los primeros 5
      let message = `🔍 *Resultados para:* ${text}\n\n`;
      searchResults.data.slice(0, 5).forEach((result, index) => {
        const title = result?.title || "Sin título"; // Validar título
        const url = result?.url || "No disponible"; // Validar URL
        message += `*${index + 1}.* ${title}\n${url}\n\n`;
      });

      // Enviar resultados al chat
      await conn.sendMessage(
        m.chat,
        { text: message.trim(), mentions: [m.sender] },
        { quoted: m }
      );

      // Reacción indicando éxito
      await m.react("☑️");
    } else {
      throw new Error(
        `Uso incorrecto del comando. Intenta usarlo así:\n\n*${usedPrefix + command} <url|texto>*`
      );
    }
  } catch (error) {
    console.error(error);
    await conn.sendMessage(
      m.chat,
      { text: `❌ Ocurrió un error:\n${error.message}` },
      { quoted: m }
    );
  }
};

handler.command = ["pinterest", "pinsearch"];
export default handler;