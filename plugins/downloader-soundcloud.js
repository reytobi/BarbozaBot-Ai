import fetch from "node-fetch";
import yts from "yt-search";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const streamPipeline = promisify(pipeline);

// API en formato Base64
const encodedApi = "aHR0cHM6Ly9hcGkudnJlZGVuLndlYi5pZC9hcGkveXRtcDM=";

// Función para decodificar la URL de la API
const getApiUrl = () => Buffer.from(encodedApi, "base64").toString("utf-8");

// Función para obtener datos de la API con reintentos
const fetchWithRetries = async (url, maxRetries = 2) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data?.status === 200 && data.result?.download?.url) {
        return data.result;
      }
    } catch (error) {
      console.error(`Intento ${attempt + 1} fallido:`, error.message);
    }
  }
  throw new Error("No se pudo obtener la música después de varios intentos.");
};

// Función para descargar el archivo de audio
const downloadFile = async (url, outputPath) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al descargar el archivo: ${response.statusText}`);
  await streamPipeline(response.body, fs.createWriteStream(outputPath));
};

// Función para convertir el audio a un formato válido
const convertAudio = async (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec("libmp3lame")
      .format("mp3")
      .on("error", (error) => reject(error))
      .on("end", () => resolve(outputPath))
      .save(outputPath);
  });
};

// Handler principal
let handler = async (m, { conn, text }) => {
  if (!text || !text.trim()) {
    return conn.sendMessage(m.chat, {
      text: "❗ *Ingresa un término de búsqueda para encontrar música.*\n\n*Ejemplo:* `.play No llores más`",
    });
  }

  try {
    // Reaccionar al mensaje inicial con 🕒
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    // Buscar en YouTube
    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    // Validar duración máxima de 12 minutos
    const videoDurationInSeconds = video.duration.seconds || 0;
    if (videoDurationInSeconds === 0 || videoDurationInSeconds > 12 * 60) {
      throw new Error("Solo se permiten audios con una duración de 12 minutos o menos.");
    }

    // Obtener datos de descarga
    const apiUrl = `${getApiUrl()}?url=${encodeURIComponent(video.url)}`;
    const apiData = await fetchWithRetries(apiUrl);

    // Definir rutas temporales
    const tempDir = "./temp";
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir); // Crear directorio si no existe
    const tempInputPath = path.resolve(tempDir, `${video.title}-input.mp3`);
    const tempOutputPath = path.resolve(tempDir, `${video.title}.mp3`);

    // Descargar el archivo de audio
    await downloadFile(apiData.download.url, tempInputPath);

    // Convertir el audio descargado
    await convertAudio(tempInputPath, tempOutputPath);

    // Enviar información del video con miniatura
    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: `🎵 *Título:* ${video.title}\n👁️ *Vistas:* ${video.views}\n⏳ *Duración:* ${video.timestamp}\n✍️ *Autor:* ${video.author.name}`,
    });

    // Enviar el archivo de audio convertido
    const audioMessage = {
      audio: { url: tempOutputPath },
      mimetype: "audio/mpeg",
      fileName: `${video.title}.mp3`,
    };

    await conn.sendMessage(m.chat, audioMessage, { quoted: m });

    // Reaccionar al mensaje original con ✅
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    // Eliminar archivos temporales
    fs.unlinkSync(tempInputPath);
    fs.unlinkSync(tempOutputPath);
  } catch (error) {
    console.error("Error:", error);

    // Reaccionar al mensaje original con ❌
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });

    await conn.sendMessage(m.chat, {
      text: `❌ *Error al procesar tu solicitud:*\n${error.message || "Error desconocido"}`,
    });
  }
};

// Cambia el Regex para que reconozca ".play"
handler.command = /^play$/i;

export default handler;