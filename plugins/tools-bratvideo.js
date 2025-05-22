
import fetch from 'node-fetch';

const handler = async (m, { conn, args}) => {
  if (!args[0]) {
    return m.reply('🚩 Por favor, proporciona un texto para generar el sticker animado.\n_Ejemplo:.bratsticker Hola mundo_');
}

  const text = args.join(' ');
  const apiUrl = `https://api.nekorinn.my.id/maker/bratvid?text=${encodeURIComponent(text)}`;

  try {
    m.reply('⏳ Generando tu sticker animado, por favor espera un momento...');

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error al generar el video: ${response.statusText}`);

    const buffer = await response.buffer();

    await conn.sendFile(m.chat, buffer, 'bratsticker.webp', '', m, { asSticker: true});
} catch (error) {
    console.error('Error al generar el sticker:', error);
    m.reply('🚩 Ocurrió un error al generar el sticker animado. Por favor, intenta nuevamente más tarde.');
}
};

handler.command = ['bratv', 'stickerbrat'];
export default handler;