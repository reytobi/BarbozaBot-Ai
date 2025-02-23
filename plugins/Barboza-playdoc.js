import fetch from "node-fetch";

// Reconstrucción de la URL
const reconstructUrl = () => {
  const encoded = "aHR0cHM6Ly9tYWhpcnUtc2hpaW5hLnZlcmNlbC5hcHAvZG93bmxvYWQveXRtcDM=";
  return Buffer.from(encoded, "base64").toString("utf-8");
};

const fetchWithRetries = async (url, maxRetries = 2) => {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data?.status && data?.data?.download) {
        return data.data;
      }
    } catch (error) {
      console.error(`Error en el intento ${attempt + 1}:`, error.message);
    }
    attempt++;
  }
  throw new Error("No se pudo obtener una respuesta válida después de varios intentos.");
};

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text || !/^https:\/\/(www\.)?youtube\.com\/watch\?v=/.test(text)) {
    return conn.sendMessage(m.chat, {
      text: `> Por favor ingresa un enlace de YouTube.*\n\n🍁 *Ejemplo:* ${usedPrefix}ytmp3 https://youtube.com/watch?v=f6KSlVffvQc`,
    });
  }

  // Reacción con disco (📀) en lugar de reloj (🕐)
  const key = await conn.sendMessage(m.chat, {
    text: `> @ꜱɪꜱᴋᴇᴅ - ʟᴏᴄᴀʟ - 𝟢𝟨\n> 𝙱𝚞𝚜𝚌𝚊𝚗𝚍𝚘 📀`,
  });

  try {
    const apiUrl = `${reconstructUrl()}?url=${encodeURIComponent(text)}`;
    const apiData = await fetchWithRetries(apiUrl);
    const { title, duration, views, author, url, thumbnail, download } = apiData;

    const description = `🎵 *Título:* ${title}\n👤 *Autor:* ${author.name}\n⏳ *Duración:* ${duration}\n👀 *Vistas:* ${views}\n🔗 *URL:* ${url}\n\n> @ꜱɪꜱᴋᴇᴅ - ʟᴏᴄᴀʟ - 𝟢𝟨`;

    await conn.sendMessage(m.chat, { text: description, edit: key });

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: download },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`,
        caption: `@ꜱɪꜱᴋᴇᴅ - ʟᴏᴄᴀʟ - 𝟢𝟨`,
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ *Ocurrió un error al intentar procesar tu solicitud:*\n${error.message || "Error desconocido"}`,
      edit: key,
    });
  }
};

handler.command = /^ytmp3$/i;
export default handler;