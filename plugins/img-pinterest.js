
import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("❌ Ingresa un término de búsqueda.\nEjemplo: .pinterest anime");
  }

  try {
    // Llamada a la API de búsqueda de imágenes en Pinterest
    const apiUrl = `https://api.vreden.my.id/api/search/pinterest?query=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Validar respuesta de la API
    if (!data?.result?.length) {
      return m.reply("❌ No se encontraron imágenes. Intenta con otra búsqueda.");
    }

    // Obtener la primera imagen del resultado
    const imageUrl = data.result[0];

    // Enviar imagen al chat
    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `🔎 *Resultado de búsqueda en Pinterest*\n📌 *Término:* ${text}\n🔗 *Fuente:* Pinterest`
    }, { quoted: m });

    await m.react("✅"); // Confirmación de éxito
  } catch (error) {
    console.error(error);
    await m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
  }
};

handler.command = ["pinterest"];
handler.help = ["pinterest <término>"];
handler.tags = ["image"];

export default handler;
