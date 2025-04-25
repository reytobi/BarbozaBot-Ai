
import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("❌ Ingresa un título o nombre de la canción para buscar y descargar.\nEjemplo: .playmp4 DJ malam pagi slowed");
  }

  try {
    // Llamada a la API para obtener el video MP4
    const apiUrl = `https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Validar respuesta de la API
    if (!data?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el video. Verifica el nombre o intenta con otro.");
    }

    // Enviar video MP4 al chat con detalles
    await conn.sendMessage(m.chat, {
      video: { url: data.result.download.url },
      caption: `🎥 *Video Descargado de YouTube*\n\n🔖 *Título:* ${data.result.title || "Sin título"}\n🎶 *Autor:* ${data.result.author || "Desconocido"}\n⏱️ *Duración:* ${data.result.duration || "N/A"}\n🌐 *Enlace original:* ${data.result.url}`
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