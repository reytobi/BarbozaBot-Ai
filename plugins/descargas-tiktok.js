
import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return m.reply('🚩 Proporciona una URL de TikTok.\n📌 Ejemplo: `.tiktokurl https://www.tiktok.com/@usuario/video/1234567890`');
  }

  const url = args[0];
  const apiUrl = `https://api.nekorinn.my.id/downloader/tikwm?url=${encodeURIComponent(url)}`;

  try {
    m.reply('⏳ Procesando el enlace, espera un momento...');

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error al obtener el enlace: ${response.statusText}`);

    const json = await response.json();
    if (json.data?.play) {
      await conn.sendMessage(m.chat, { text: `🎥 *Enlace de descarga:* ${json.data.play}` }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { text: "❌ No se pudo obtener el enlace del video. Verifica la URL." }, { quoted: m });
    }
  } catch (error) {
    console.error('❌ Error al obtener el enlace:', error);
    m.reply('🚩 Ocurrió un error, intenta nuevamente más tarde.');
  }
};

handler.command = ['tiktok'];
export default handler;