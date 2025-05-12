import axios from 'axios';
import yts from 'yt-search';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`> 𝘌𝘴𝘤𝘳𝘪𝘣𝘦 𝘦𝘭 𝘯𝘰𝘮𝘣𝘳𝘦 𝘥𝘦𝘭 𝘷𝘪𝘥𝘦𝘰 𝘱𝘢𝘳𝘢 𝘱𝘰𝘥𝘦𝘳 𝘥𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳𝘭𝘰.\n\n𝘌𝘫𝘦𝘮𝘱𝘭𝘰: .𝘱𝘭𝘢𝘺1 𝘣𝘰𝘭𝘪𝘭𝘭𝘰𝘴 𝘵𝘳𝘢𝘷𝘪𝘦𝘴𝘰𝘴.🥖`);
  }

  await conn.sendMessage(m.chat, {
    react: { text: '⏳', key: m.key }
  });

  try {
    const search = await yts(text);
    const video = search.videos[0];
    if (!video) throw new Error('> 𝘕𝘰 𝘴𝘦 𝘱𝘶𝘳𝘰 𝘰𝘣𝘵𝘦𝘯𝘦𝘳 𝘦𝘭 𝘢𝘶𝘥𝘪𝘰.🥖');

    const videoUrl = video.url;
    const thumbnail = video.thumbnail;
    const title = video.title;
    const fduration = video.timestamp;
    const views = video.views.toLocaleString();
    const channel = video.author.name || 'Desconocido';

    const infoMessage = `
╔═════════════╗
║ 𝘠𝘖𝘜𝘛𝘜𝘉𝘌 / 𝘉𝘖𝘓𝘐𝘓𝘓𝘖𝘉𝘖𝘛 🥖
╚═════════════╝
  
> 𝘚𝘪 𝘦𝘭 𝘤𝘰𝘮𝘢𝘯𝘥𝘰 𝘱𝘳𝘦𝘴𝘦𝘯𝘵𝘢 𝘱𝘳𝘰𝘣𝘭𝘦𝘮𝘢𝘴.\n𝘜𝘴𝘢 .𝘳𝘦𝘱𝘰𝘳𝘵 𝘰 𝘱𝘳𝘶𝘦𝘣𝘢 𝘤𝘰𝘯 .𝘱𝘭𝘢𝘺, 𝘭𝘰 𝘴𝘰𝘭𝘶𝘤𝘪𝘰𝘯𝘢𝘳𝘦𝘮𝘰𝘴 𝘭𝘰 𝘢𝘯𝘵𝘦𝘴 𝘱𝘰𝘴𝘪𝘣𝘭𝘦. 🥖`;

    await conn.sendFile(m.chat, thumbnail, 'imagen.jpg', infoMessage, m);

    const apiURL = `https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(videoUrl)}&type=audio&quality=128kbps&apikey=russellxz`;
    const res = await axios.get(apiURL);
    const json = res.data;

    if (!json.status || !json.data?.url) throw new Error("> 𝘕𝘰 𝘴𝘦 𝘱𝘶𝘳𝘰 𝘰𝘣𝘵𝘦𝘯𝘦𝘳 𝘦𝘭 𝘢𝘶𝘥𝘪𝘰.🥖");

    const tmpDir = path.join('./tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const rawPath = path.join(tmpDir, `${Date.now()}_raw.m4a`);
    const finalPath = path.join(tmpDir, `${Date.now()}_final.mp3`);

    const audioRes = await axios.get(json.data.url, { responseType: 'stream' });
    await streamPipeline(audioRes.data, fs.createWriteStream(rawPath));

    await new Promise((resolve, reject) => {
      ffmpeg(rawPath)
        .audioCodec('libmp3lame')
        .audioBitrate('128k')
        .format('mp3')
        .save(finalPath)
        .on('end', resolve)
        .on('error', reject);
    });

    await conn.sendMessage(m.chat, {
      audio: fs.readFileSync(finalPath),
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: m });

    fs.unlinkSync(rawPath);
    fs.unlinkSync(finalPath);

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { text: `❌ *Error:* ${err.message}` }, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }
};

handler.command = ['play'];
export default handler;