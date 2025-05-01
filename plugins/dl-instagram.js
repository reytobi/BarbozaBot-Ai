
import fetch from 'node-fetch';

const handler = async (m, { args }) => {
  if (!args[0]) {
    return m.reply('🚩 Por favor, proporciona un enlace de Instagram.\n_Ejemplo: .ig https://www.instagram.com/p/XXXXXXXXX/_');
  }

  const url = args[0];
  const apiUrl = `https://api.nekorinn.my.id/downloader/instagram?url=${encodeURIComponent(url)}`;

  try {
    // Enviar mensaje de espera
    m.reply('⏳ Descargando contenido de Instagram, espera un momento...');

    // Hacer solicitud a la API
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error en la descarga: ${response.statusText}`);

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      throw new Error('No se encontró contenido disponible en el enlace proporcionado.');
    }

    // Enviar el contenido descargado al usuario
    const mediaUrl = result.data[0].url; // Se obtiene el primer archivo de la lista
    m.reply(`📥 **Descarga completa:**\n${mediaUrl}`);
  } catch (error) {
    console.error('Error al descargar contenido de Instagram:', error);
    m.reply('🚩 Ocurrió un error durante la descarga. Por favor, intenta nuevamente más tarde.');
  }
};

// Definir el comando
handler.command = ['ig', 'instagram'];
export default handler;