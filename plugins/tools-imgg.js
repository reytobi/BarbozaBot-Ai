
import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return m.reply('🚩 Por favor, proporciona un texto para generar la imagen.\n_Ejemplo: .imagen un hermoso paisaje_');
  }

  const text = args.join(' ');
  const apiUrl = `https://api.nekorinn.my.id/ai-img/imagen?text=${encodeURIComponent(text)}`;

  try {
    // Enviar mensaje de espera
    m.reply('⏳ Generando tu imagen, espera un momento...');

    // Hacer solicitud a la API
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error al generar la imagen: ${response.statusText}`);

    // Obtener el resultado
    const buffer = await response.buffer();

    // Enviar la imagen generada
    await conn.sendFile(m.chat, buffer, 'imagen.jpg', `🖼️ *Imagen generada para:* _${text}_`, m);
  } catch (error) {
    console.error('Error al generar la imagen:', error);
    m.reply('🚩 Ocurrió un error al generar la imagen. Por favor, intenta nuevamente más tarde.');
  }
};

// Definición del comando
handler.command = ['immg'];
export default handler;