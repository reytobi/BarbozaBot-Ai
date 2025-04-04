import yts from 'yt-search';
import fs from 'fs';
import axios from 'axios';

// Función para esperar X milisegundos
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// =======================================================
// Función para obtener la URL de descarga de video (mp4)
// Se recorren las 3 APIs y se reintenta el proceso globalmente hasta 2 veces.
// No se notifica al usuario sobre los reintentos, solo se reaccionan sobre el mismo mensaje.
const getVideoDownloadUrl = async (videoUrl, reactionMessage, conn, chat) => {
  const maxGlobalAttempts = 2;
  const apis = [
    {
      url: 'https://api.vreden.my.id/api/ytmp4?url=',
      timeout: 7000,
      parseResponse: (json) => {
        // API Vreden: status numérico 200 y download.url + download.status true
        if (
          json?.status === 200 &&
          json?.result?.download?.url &&
          json?.result?.download?.status === true
        ) {
          return { url: json.result.download.url.trim(), title: json.result.metadata.title };
        }
        return null;
      }
    },
    {
      url: 'https://api.siputzx.my.id/api/d/ytmp4?url=',
      timeout: 7000,
      parseResponse: (json) => {
        // API Siputzx: status boolean true y en data la propiedad dl
        if (json?.status === true && json?.data?.dl) {
          return { url: json.data.dl.trim(), title: json.data.title };
        }
        return null;
      }
    },
    {
      url: 'https://api.agungny.my.id/api/youtube-videov2?url=',
      timeout: 7000,
      parseResponse: (json) => {
        // API Agungny: status string "true" y en result la propiedad url
        if (json?.status === "true" && json?.result?.url) {
          return { url: json.result.url.trim(), title: json.result.title };
        }
        return null;
      }
    }
  ];

  for (let attempt = 0; attempt < maxGlobalAttempts; attempt++) {
    // Recorremos cada API
    for (const api of apis) {
      try {
        const response = await axios.get(`${api.url}${encodeURIComponent(videoUrl)}`, { timeout: api.timeout });
        const json = response.data;
        const result = api.parseResponse(json);
        if (result && result.url) {
          // Verificar que la URL de descarga funcione mediante petición HEAD
          try {
            const headRes = await axios.head(result.url, { timeout: 10000 });
            if (headRes.status === 200) {
              return result;
            }
          } catch (err) {
            console.error(`La URL de descarga de API ${api.url} no funciona:`, err.message);
          }
        }
      } catch (error) {
        console.error(`Error al obtener respuesta de API ${api.url}:`, error.message);
      }
    }
    // Si ninguna API funcionó en este intento, reaccionamos sobre el mismo mensaje y esperamos brevemente
    await conn.sendMessage(chat, { react: { text: '🔄', key: reactionMessage.key } }, { quoted: reactionMessage });
    await wait(2000);
  }
  return null;
};

// =======================================================
// Función para enviar el video (mp4) con externalAdReply usando una imagen fija.
// Se revisa el tamaño del archivo y, si supera los 80 MB, se envía como documento.
// Si se envía como video, no se incluye el nombre (ya se muestra en la información).
// Si se envía como documento, se incluye el nombre del video.
const sendVideoNormal = async (conn, chat, videoUrl, videoTitle, maxRetries = 2) => {
  let attempt = 0;
  let thumbnailBuffer = null;
  const THRESHOLD = 80 * 1024 * 1024; // 80 MB en bytes
  let sendAsDocument = false;

  try {
    // Se utiliza una imagen fija para el thumbnail
    const response = await axios.get('https://files.catbox.moe/skhywv.jpg', { responseType: 'arraybuffer' });
    thumbnailBuffer = Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error("Error al obtener thumbnail:", error.message);
  }

  // Verificar tamaño del archivo mediante una petición HEAD
  try {
    const headRes = await axios.head(videoUrl);
    const fileSize = headRes.headers['content-length'];
    if (fileSize && Number(fileSize) > THRESHOLD) {
      sendAsDocument = true;
      console.log(`Tamaño del archivo (${Number(fileSize)} bytes) supera el límite, se enviará como documento.`);
    }
  } catch (err) {
    console.error("Error obteniendo tamaño del archivo:", err.message);
  }

  while (attempt < maxRetries) {
    try {
      let messageData;
      if (sendAsDocument) {
        // Envío como documento e incluye el nombre del video
        messageData = {
          document: { url: videoUrl },
          mimetype: 'video/mp4',
          caption: `${videoTitle}`,
          fileName: `${videoTitle}.mp4`,
          contextInfo: {
            externalAdReply: {
              title: `${videoTitle}`,
              body: "MediaHub",
              previewType: 'PHOTO',
              thumbnail: thumbnailBuffer,
              mediaType: 2,
              renderLargerThumbnail: false,
              showAdAttribution: true,
              sourceUrl: 'https://ella.no.teama.pe'
            }
          }
        };
      } else {
        // Envío como video sin incluir el nombre (ya se muestra en la info previa)
        messageData = {
          video: { url: videoUrl },
          mimetype: 'video/mp4',
          caption: "",
          contextInfo: {
            externalAdReply: {
              title: "",
              body: "MediaHub",
              previewType: 'PHOTO',
              thumbnail: thumbnailBuffer,
              mediaType: 2,
              renderLargerThumbnail: false,
              showAdAttribution: true,
              sourceUrl: 'https://ella.no.teama.pe'
            }
          }
        };
      }

      await conn.sendMessage(chat, messageData, { quoted: null });
      return;
    } catch (error) {
      console.error(`❌ Error al enviar video, intento ${attempt + 1}:`, error.message);
      if (attempt < maxRetries - 1) await wait(12000);
    }
    attempt++;
  }
};

// =======================================================
// Comando para reproducir video (play2)
let play2Handler = async (m, { conn, text, usedPrefix, command }) => {
  // Validar que se ingrese un término de búsqueda
  if (!text || !text.trim()) {
    await conn.reply(
      m.chat,
      `Uso: ${usedPrefix + command} <nombre del video>\nEjemplo: ${usedPrefix + command} Nio Garcia Video`,
      m
    );
    return;
  }
  text = text.trim();

  // Obtener hora actual en Perú y definir saludo
  const currentTime = new Date().toLocaleString("en-US", { timeZone: "America/Lima" });
  const currentHour = new Date(currentTime).getHours();
  let greeting = "";
  if (currentHour >= 0 && currentHour < 12) greeting = "Buenos días 🌅";
  else if (currentHour >= 12 && currentHour < 18) greeting = "Buenas tardes 🌄";
  else greeting = "Buenas noches 🌃";

  // Extraer el número del remitente para la mención
  const userNumber = m.sender.split('@')[0];
  const reactionMessage = await conn.reply(
    m.chat,
    `${greeting} @${userNumber},\nEstoy buscando el video solicitado.\n¡Gracias por usar MediaHub!`,
    m,
    { mentions: [m.sender] }
  );

  // Enviar reacción "buscando 📀"
  await conn.sendMessage(
    m.chat,
    { react: { text: '📀', key: reactionMessage.key } },
    { quoted: m }
  );

  try {
    // Búsqueda en YouTube para obtener la información del video
    const searchResults = await yts(text);
    if (!searchResults?.videos?.length) throw new Error("No se encontraron resultados en YouTube.");

    const videoInfo = searchResults.videos[0];
    const { title, timestamp: duration, views, ago, url: videoUrl, image } = videoInfo;
    const description = `⌘━─━─≪𓄂*YouTube*𝄢─━─━⌘

➷ Título: ${title}
➷ Duración: ${duration || "Desconocida"}
➷ Vistas: ${views.toLocaleString()}
➷ Publicado: ${ago}
➷ URL: ${videoUrl}

> © Bot Barboza Ai™`;

    // Enviar imagen informativa
    await conn.sendMessage(
      m.chat,
      { image: { url: image }, caption: description },
      { quoted: m }
    );

    // Obtener URL de descarga del video usando el nuevo sistema con 2 intentos globales
    let downloadData = await getVideoDownloadUrl(videoUrl, reactionMessage, conn, m.chat);
    if (!downloadData || !downloadData.url) {
      await conn.sendMessage(
        m.chat,
        { react: { text: '🔴', key: reactionMessage.key } },
        { quoted: m }
      );
      throw new Error("No se pudo descargar el video desde ninguna API.");
    }

    // Enviar reacción de éxito "🟢"
    await conn.sendMessage(
      m.chat,
      { react: { text: '🟢', key: reactionMessage.key } },
      { quoted: m }
    );

    // Enviar el video (o documento, si supera el límite) al chat
    await sendVideoNormal(conn, m.chat, downloadData.url, downloadData.title || title);
  } catch (error) {
    console.error("❌ Error:", error);
    await conn.reply(
      m.chat,
      `🚨 *Error:* ${error.message || "Error desconocido"}`,
      m
    );
  }
};

play2Handler.command = /^(play2)$/i;

export default play2Handler;