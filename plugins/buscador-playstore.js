
import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '❌ Por favor, proporciona el nombre de la aplicación que deseas buscar.\nEjemplo: .playstore WhatsApp', m);
  }

  const query = args.join(' ');
  const apiUrl = `https://api.vreden.my.id/api/playstore?query=${encodeURIComponent(query)}`;

  try {
    await m.react('⏳'); // Reacción de "procesando"

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.result || data.result.length === 0) {
      return conn.reply(m.chat, '❌ No se encontraron aplicaciones. Intenta con otro nombre.', m);
    }

    let results = `📱 *Resultados de la búsqueda en Play Store para:* ${query}\n\n`;
    data.result.forEach((app, index) => {
      const name = app.title || 'Nombre no disponible';
      const link = app.url || 'Enlace no disponible';
      const description = app.desc || 'Descripción no disponible';
      const rating = app.rating ? `${app.rating} ⭐` : 'No disponible';

      results += `➤ *${index + 1}:* ${name}\n`;
      results += `🔗 [Enlace](${link})\n`;
      results += `📖 Descripción: ${description}\n`;
      results += `⭐ Calificación: ${rating}\n\n`;
    });

    await conn.reply(m.chat, results.trim(), m);
    await m.react('✅'); // Reacción de éxito
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error);
    await m.react('❌'); // Reacción de error
    conn.reply(m.chat, `❌ Ocurrió un error al realizar la búsqueda: ${error.message}`, m);
  }
};

handler.command = ['playstore'];
handler.help = ['playstore <nombre>'];
handler.tags = ['search'];

export default handler;
