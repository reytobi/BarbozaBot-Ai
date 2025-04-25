
import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("❌ Ingresa una descripción para generar una imagen.\nEjemplo: .imgg paisaje futurista");
  }

  try {
    // Llamada a la API para generar imagen
    const apiUrl = `https://api.vreden.my.id/api/artificial/text2image?prompt=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Validar respuesta de la API
    if (!data?.result?.image_url) {
      return m.reply("❌ No se pudo generar la imagen. Intenta con otro texto.");
    }

    // Enviar imagen generada al chat
    await conn.sendMessage(m.chat, {
      image: { url: data.result.image_url },
      caption: `🖼️ *Imagen generada con IA*\n\n🔖 *Descripción:* ${text}`
    }, { quoted: m });

    await m.react("✅"); // Confirmación de éxito
  } catch (error) {
    console.error(error);
    await m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ["imgg"];
handler.help = ["imgg <descripción>"];
handler.tags = ["image"];

export default handler;