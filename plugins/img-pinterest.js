
import fetch from 'node-fetch';

let handler = async (m, { conn, text, args }) => {
  if (!text) return m.reply(`✨ Ingresa un término o enlace para buscar/descargar contenido. Ejemplo: .pinsearch Flores`);

  try {
    if (text.includes("https://")) {
      // Proceso para descargar contenido de Pinterest
      m.react("⏳");
      const apiUrl = `https://api.sylphy.xyz/download/pinterest?url=${args[0]}&apikey=sylph`;
      let res = await fetch(apiUrl);
      let data = await res.json();

      // Validar respuesta de la API
      if (!data?.data?.download) {
        return m.reply("❌ No se pudo obtener contenido descargable del enlace proporcionado.");
      }

      // Determinar si es video o imagen
      let isVideo = data.data.download.includes(".mp4");
      let messageType = isVideo ? "video" : "image";

      // Enviar contenido al chat
      await conn.sendMessage(m.chat, {
        [messageType]: { url: data.data.download },
        caption: `💾 *Descargado desde Pinterest*\n\n🔖 *Título:* ${data.data.title || "Sin título"}\n🌐 *Enlace directo:* ${args[0]}`
      }, { quoted: m });

      m.react("✅"); // Confirmación de éxito

    } else {
      // Proceso para buscar contenido en Pinterest
      m.react("🔍");
      const apiUrl = `https://api.sylphy.xyz/search/pinterest?q=${encodeURIComponent(text)}&apikey=sylph`;
      let res = await fetch(apiUrl);
      let results = await res.json();

      if (!results?.data || results.data.length === 0) {
        return conn.reply(m.chat, `⚠️ No se encontraron resultados para "${text}".`, m);
      }

      // Mostrar los primeros 5 resultados con imágenes
      let message = `🔎 *Resultados de Pinterest para:* ${text}\n\n`;
      for (let i = 0; i < Math.min(results.data.length, 5); i++) {
        let result = results.data[i];
        let title = result.title || "Sin título";
        let link = result.url || "No disponible";

        // Enviar cada resultado como mensaje con imagen
        await conn.sendMessage(m.chat, {
          image: { url: result.image_large_url },
          caption: `🎨 *Resultado ${i + 1}:*\n\n🔖 *Título:* ${title}\n🔗 *Enlace:* ${link}`
        }, { quoted: m });
      }

      m.react("✅"); // Confirmación de éxito
    }
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `❌ Error al procesar la solicitud:\n${error.message}`, m);
  }
};

handler.help = ['pinsearch', 'pindownload'];
handler.command = ['pinsearch', 'pindownload', 'pin'];
handler.tags = ['tools'];

export default handler;