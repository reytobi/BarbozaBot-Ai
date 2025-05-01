import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`> 𝘌𝘴𝘤𝘳𝘪𝘣𝘦 𝘦𝘭 𝘯𝘰𝘮𝘣𝘳𝘦 𝘥𝘦𝘭 𝘷𝘪𝘥𝘦𝘰 𝘱𝘢𝘳𝘢 𝘱𝘰𝘥𝘦𝘳 𝘥𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳𝘭𝘰.\n\n𝘌𝘫𝘦𝘮𝘱𝘭𝘰: .𝘱𝘭𝘢𝘺2 Lupita .🥖`);
  }

  await conn.sendMessage(m.chat, {
    react: { text: '⏳', key: m.key }
  });

  try {
    const searchUrl = `https://api.neoxr.eu/api/video?q=${encodeURIComponent(text)}&apikey=russellxz`;
    const searchRes = await axios.get(searchUrl);
    const videoInfo = searchRes.data;
    if (!videoInfo || !videoInfo.data?.url) throw new Error('> 𝘕𝘰 𝘴𝘦 𝘱𝘶𝘥𝘰 𝘦𝘯𝘤𝘰𝘯𝘵𝘳𝘢𝘳 𝘦𝘭 𝘷𝘪𝘥𝘦𝘰.🥖');

    const title = videoInfo.title || 'video';
    const thumbnail = videoInfo.thumbnail;
    const duration = videoInfo.fduration || '0:00';
    const views = videoInfo.views || 'N/A';
    const author = videoInfo.channel || 'Desconocido';
    const videoLink = `https://www.youtube.com/watch?v=${videoInfo.id}`;

    const captionPreview = `
╔═════════════╗
║ 𝘠𝘖𝘜𝘛𝘜𝘉𝘌
╚═════════════╝
  
🎼 𝘛𝘪𝘵𝘶𝘭𝘰: ${title}
⏱️ 𝘋𝘶𝘳𝘢𝘤𝘪ó𝘯: ${duration}
👁️ 𝘝𝘪𝘴𝘵𝘢𝘴: ${views}
👤 𝘈𝘶𝘵𝘰𝘳: ${author}
🔗 𝘓𝘪𝘯𝘬: ${videoLink}


> 𝘚𝘪 𝘦𝘭 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 𝘱𝘳𝘦𝘴𝘦𝘯𝘵𝘢 𝘱𝘳𝘰𝘣𝘭𝘦𝘮𝘢𝘴, 𝘶𝘴𝘢 .𝘳𝘦𝘱𝘰𝘳𝘵 𝘱𝘢𝘳𝘢 𝘴𝘰𝘭𝘶𝘤𝘪𝘰𝘯𝘢𝘳𝘭𝘰 𝘭𝘰 𝘢𝘯𝘵𝘦𝘴 𝘱𝘰𝘴𝘪𝘣𝘭𝘦.`;

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: captionPreview
    }, { quoted: m });

    const qualities = ['720p', '480p', '360p'];
    let videoData = null;
    for (let quality of qualities) {
      try {
        const apiUrl = `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(videoLink)}&apikey=barbozaxz&type=video&quality=${quality}`;
        const response = await axios.get(apiUrl);
        if (response.data?.status && response.data?.data?.url) {
          videoData = {
            url: response.data.data.url,
            title: response.data.title || title,
            thumbnail: response.data.thumbnail || thumbnail,
            duration: response.data.fduration || duration,
            views: response.data.views || views,
            channel: response.data.channel || author,
            quality: response.data.data.quality || quality,
            size: response.data.data.size || 'Desconocido',
            publish: response.data.publish || 'Desconocido',
            id: response.data.id || videoInfo.id
          };
          break;
        }
      } catch {
        continue;
      }
    }
    if (!videoData) throw new Error('> 𝘕𝘰 𝘴𝘦 𝘱𝘶𝘥𝘰 𝘦𝘯𝘤𝘰𝘯𝘵𝘳𝘢𝘳 𝘦𝘭 𝘷𝘪𝘥𝘦𝘰.');

    const tmpDir = path.join('./tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const filename = `${Date.now()}_video.mp4`;
    const filePath = path.join(tmpDir, filename);

    const resDownload = await axios.get(videoData.url, {
      responseType: 'stream',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    await streamPipeline(resDownload.data, fs.createWriteStream(filePath));

    const stats = fs.statSync(filePath);
    if (!stats || stats.size < 100000) {
      fs.unlinkSync(filePath);
      throw new Error('𝘕𝘰 𝘴𝘦 𝘱𝘶𝘥𝘰 𝘦𝘯𝘤𝘰𝘯𝘵𝘳𝘢𝘳 𝘦𝘭 𝘷𝘪𝘥𝘦𝘰.🥖');
    }

    const finalText = `> Barboza`;

    await conn.sendMessage(m.chat, {
      video: fs.readFileSync(filePath),
      mimetype: 'video/mp4',
      fileName: `${videoData.title}.mp4`,
      caption: finalText,
      gifPlayback: false
    }, { quoted: m });

    fs.unlinkSync(filePath);

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, {
      text: `❌ *Error:* ${err.message}`
    }, { quoted: m });
    await conn.sendMessage(m.chat, {
      react: { text: '❌', key: m.key }
    });
  }
};

handler.command = ['play2'];
export default handler;