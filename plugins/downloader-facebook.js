
import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("❌ Ingresa un enlace válido de Facebook.\nEjemplo: .fb https://www.facebook.com/username/videos/123456789/");
  }

  try {
    // Llamada a la API para descargar contenido de Facebook
    const apiUrl = `https://api.vreden.my.id/api/fbdl?url=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Validar respuesta de la API
    if (!data?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el contenido. Verifica el enlace.");
    }

    // Verificar si el contenido es video o imagen
    const isVideo = data.result.download.url.includes(".mp4");

    // Enviar contenido al chat con descripción
    await conn.sendMessage(m.chat, {
      [isVideo ? "video" : "image"]: { url: data.result.download.url },
      caption: `🎥 *Contenido descargado desde Facebook*\n\n🔗 *Enlace original:* ${text}`
    }, { quoted: m });

    await m.react("✅"); // Confirmación de éxito
  } catch (error) {
    console.error(error);
    await m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ["fb"];
handler.help = ["fb <enlace>"];
handler.tags = ["download"];

export default handler;