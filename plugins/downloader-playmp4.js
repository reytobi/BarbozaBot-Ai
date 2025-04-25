
import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("❌ Ingresa un título o nombre de la canción para buscar y descargar.\nEjemplo: .playmp4 DJ malam pagi slowed");
  }

  try {
    const apiUrl = `https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el video. Verifica el nombre o intenta con otro.");
    }

    const videoDetails = `
🎥 *Video Descargado de YouTube*
──────────────────────
📌 *Título:* ${data.result.title || "Sin título"}
🎶 *Autor:* ${data.result.author || "Desconocido"}
📅 *Fecha de Publicación:* ${data.result.publishedAt || "N/A"}
⏱️ *Duración:* ${data.result.duration || "N/A"}
👁️ *Vistas:* ${data.result.views || "N/A"}
❤️ *Likes:* ${data.result.likes || "N/A"}
💾 *Calidad de Video:* ${data.result.quality || "N/A"}
🌐 *Enlace Original:* [Ver en YouTube](${data.result.url})
──────────────────────
`;

    await conn.sendMessage(m.chat, {
      video: { url: data.result.download.url },
      caption: videoDetails.trim()
    }, { quoted: m });

    await m.react("✅"); // Confirmación de éxito
  } catch (error) {
    console.error(error);
    await m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ["playmp4"];
handler.help = ["playmp4 <nombre o título>"];
handler.tags = ["download"];

export default handler;