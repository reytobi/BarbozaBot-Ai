import fetch from "node-fetch";
import yts from "yt-search"; // Asegúrate de tener instalado yt-search

// Función para decodificar Base64
const decodeBase64 = (encoded) => Buffer.from(encoded, "base64").toString("utf-8");

const fetchWithRetries = async (url, maxRetries = 2) => {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.status === 200 && data.data && data.data.download && data.data.download.url) {
        return data.data; // Retorna el resultado si es válido
      }
    } catch (error) {
      console.error(`Error en el intento ${attempt + 1}:`, error.message);
    }
    attempt++;
  }
  throw new Error("No se pudo obtener una respuesta válida después de varios intentos.");
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `⚠️ *¡Atención!*\n\n💡 *Por favor ingresa un término de búsqueda para encontrar el video.*\n\n📌 *Ejemplo:* ${usedPrefix}play2 Never Gonna Give You Up`,
    });
  }

  try {
    await conn.sendMessage(m.chat, {
      text: `
╭━━━🌐📡━━━╮  
   🔍 **Buscando en ☆Barboza Bot Ai☆** 🔍  
╰━━━🌐📡━━━╯  

✨ *Estamos localizando tu video...*  
📥 *Por favor espera unos instantes mientras procesamos tu solicitud.*  

⏳ *Esto puede tardar unos segundos.*  
      `,
    });

    // Búsqueda en YouTube
    const searchResults = await yts(text);
    const video = searchResults.videos[0]; // Tomamos el primer resultado

    if (!video) {
      return conn.sendMessage(m.chat, {
        text: `❌ *No se encontraron resultados para:* ${text}`,
      });
    }

    const { title, url: videoUrl, timestamp, views, author, image, ago } = video;

    // URL de la API ofuscada
    const encodedApiUrl = "aHR0cHM6Ly9yZXN0YXBpLmFwaWJvdHdhLmJpei5pZC9hcGkveXRtcDQ=";
    const encodedErrorMessage = "QXBpIHN1c3BlbmRpZGEgU2llcmVzIEVsIFByb3BpZXRhcmlvIFBhZ2EgTGEgRGV1ZGEgJDEw";

    // Información del video
    const videoInfo = `
╭━━━☆☆☆━━━╮  
 *★ ☆Barboza Bot Ai☆ ★*
╰━━━☆☆☆━━━╯  
🎵 **Título:**  ${title}  

📅 **Subido hace:**  ${ago}  

⏱️ **Duración:**  ${timestamp}  

👀 **Vistas:**  ${views.toLocaleString()}  

👤 **Autor:**  ${author.name}  

🔗 **Enlace del video:**  ${videoUrl}  
╭━━━━━━☆☆☆━━━━━━━╮    
 > Por favor espera 🔄 ....  
╰━━━━━━☆☆☆━━━━━━━╯  
    `;

    // Envía la información del video
    await conn.sendMessage(m.chat, { image: { url: image }, caption: videoInfo });

    // Enviar mensaje de error ofuscado
    const errorMessage = decodeBase64(encodedErrorMessage); // Decodifica el mensaje
    await conn.sendMessage(m.chat, {
      text: `❌ *${errorMessage}*`,
    });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ *Ocurrió un error al intentar procesar tu solicitud:*\n${error.message || "Error desconocido"}`,
    });
  }
};

handler.command = /^play2$/i; // Solo funciona con play2

export default handler;
