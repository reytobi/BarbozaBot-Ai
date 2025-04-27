import from 'node-fetch';

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '❌ Por favor, proporciona un código de país.\nEjemplo: .numeinfo +58', m);
  }

  const numCode = args[0];
  const apiUrl = `https://api.dorratz.com/v2/pais/${encodeURIComponent(numCode)}`;

  try {
    await m.react('⏳'); // Reacción de "procesando"

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.result || Object.keys(data.result).length === 0) {
      return conn.reply(m.chat, '❌ No se encontró información sobre el código proporcionado.', m);
    }

    const { country, prefix, continent, currency, capital } = data.result;

    const infoMessage = `🌍 *Información del País*\n\n
    ➤ País: ${country || 'No disponible'}
    ➤ Prefijo: ${prefix || 'No disponible'}
    ➤ Continente: ${continent || 'No disponible'}
    ➤ Moneda: ${currency || 'No disponible'}
    ➤ Capital: ${capital || 'No disponible'}`;

    await conn.reply(m.chat, infoMessage.trim(), m);
    await m.react('✅'); // Reacción de éxito
  } catch (error) {
    console.error('Error al obtener la información del país:', error);
    await m.react('❌'); // Reacción de error
    conn.reply(m.chat, `❌ Ocurrió un error al obtener la información: ${error.message}`, m);
  }
};

handler.command = ['numeinfo'];
handler.help = ['numeinfo <código>'];
handler.tags = ['info'];

export default handler;
