
import fetch from "node-fetch";
import yts from "yt-search";

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply("🔍 *Ingresa el nombre de un video o una URL de YouTube.*");

  try {
    m.react("🔄");
    let res = await yts(text);
    let video = res.all[0];

    if (!video) return m.reply("❌ *No se encontró el video, intenta con otro nombre.*");

    const mensaje = `
🎵 *Título:* ${video.title}
📽️ *Autor:* ${video.author.name}
⏳ *Duración:* ${video.duration.timestamp}
👀 *Vistas:* ${video.views}
🔗 *Enlace:* ${video.url}
`;

    await conn.sendMessage(m.chat, { text: mensaje });

    if (command === "play") {
      const api = await (await fetch(`https://ytdl.sylphy.xyz/dl/mp3?url=${video.url}&quality=128`)).json();
      await conn.sendFile(m.chat, api.data.dl_url, api.data.title, "", m);
      await m.react("🎶");
    } else if (command === "playvid") {
      const api = await (await fetch(`https://ytdl.sylphy.xyz/dl/mp4?url=${video.url}&quality=480`)).json();
      await conn.sendFile(m.chat, api.data.dl_url, api.data.title, "", m);
      await m.react("🎬");
    }
  } catch (e) {
    m.reply("⚠️ *Error en la descarga, intenta nuevamente más tarde.*");
  }
};

handler.help = ["play", "playvid"];
handler.tags = ["multimedia"];
handler.command = ["play", "playvid"];
export default handler;