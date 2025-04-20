
import fetch from 'node-fetch';
import sharp from 'sharp';
import fileType from 'file-type';

const handler = async (m, { conn }) => {
  try {
    const imageUrl = m.quoted ? m.quoted.url : null;

    if (!imageUrl) {
      return conn.sendMessage(m.chat, { text: "Por favor, envía una imagen para mejorar su calidad." }, { quoted: m });
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Error al obtener la imagen: ${response.statusText}`);
    }

    const buffer = await response.buffer();
    
    // Detectar tipo de archivo
    const type = await fileType.fromBuffer(buffer);
    
    if (!type || !['image/png', 'image/jpeg'].includes(type.mime)) {
      throw new Error(`Formato de imagen no soportado: ${type ? type.mime : 'desconocido'}`);
    }

    // Procesar la imagen
    const improvedImage = await sharp(buffer)
      .resize({ width: 800 }) // Cambia el tamaño según tus necesidades
      .toFormat('jpeg', { quality: 90 }) // Mejora la calidad a 90%
      .toBuffer();

    // Enviar la imagen mejorada
    conn.sendFile(m.chat, improvedImage, 'improved_image.jpg', 'Aquí tienes tu imagen mejorada.', m);
  } catch (error) {
    console.error(error);
    conn.sendMessage(m.chat, { text: `Ocurrió un error al procesar la imagen: ${error.message}` }, { quoted: m });
  }
};

handler.command = /^(hd|improve)$/i; // Comando para activar la mejora
export default handler;