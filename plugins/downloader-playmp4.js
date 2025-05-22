
import fetch from 'node-fetch';

const handler = async (m, { conn, args}) => {
  if (!args[0]) {
    return m.reply('🚩 Por favor, proporciona un título o palabra clave para buscar el video.\n_Ejemplo:.play2 DJ malam pagi slowed_');
}

  const query = args.join(' ');
  const apiUrl = `https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(query)}`;

  try {
    m.reply('⏳ Buscando el video, por favor espera un momento...');

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error en la búsqueda: ${response.statusText}`);

    const data = await response.json();

    if (!data ||!data.result ||!data.result.url) {
      return m.reply('🚩 No se pudo encontrar el video. Intenta con otro título.');
}

    const videoUrl = data.result.url;
    const title = data.result.title || 'Video encontrado';

    await conn.sendFile(m.chat, videoUrl, `${title}.mp4`, `🎥 *Video encontrado:* _${title}_\n🔗 ${videoUrl}`, m);
} catch (error) {
    console.error('Error al obtener el video:', error);
    m.reply('🚩 Ocurrió un error al obtener el video. Por favor, intenta nuevamente más tarde.');
}
};

handler.command = ['play2', 'ytplay2'];
export default handler;