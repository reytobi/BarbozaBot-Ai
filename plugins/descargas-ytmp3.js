
import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("❌ Ingresa un enlace válido de YouTube.\nEjemplo: .ytmp3 https://www.youtube.com/watch?v=dQw4w9WgXcQ");

  try {
    // Llamada a la API para descargar el audio en MP3
    let apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(text)}`;
    let response = await fetch(apiUrl);
    let data = await response.json();

    // Validar respuesta de la API
    if (!data?.result?.download?.url) {
      return m.reply("❌ No se pudo obtener el audio del video. Verifica el enlace.");
    }

    // Enviar audio al chat
    await conn.sendMessage(m.chat, {
      audio: { url: data.result.download.url },
      mimetype: "audio/mpeg",
      fileName: `${data.result.title || "audio"}.mp3`
    }, { quoted: m });

    await m.react("✅"); // Confirmación de éxito
  } catch (error) {
    console.error(error);
    await m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ["ytmp3"];
handler.help = ["ytmp3 <enlace>"];
handler.tags = ["download"];

export default handler;