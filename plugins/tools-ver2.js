
let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted || !m.quoted.message || !m.quoted.message.imageMessage) {
    throw `[❗️INFO❗️] Debes responder a una imagen para usar este comando.`;
  }

  // Recuperar la imagen original del mensaje citado
  const imageMessage = m.quoted.message.imageMessage;
  const imageUrl = await conn.downloadMediaMessage(m.quoted);

  if (!imageUrl) {
    throw `[❗️ERROR❗️] No se pudo recuperar la imagen. Asegúrate de responder a un mensaje válido.`;
  }

  // Mensaje de confirmación con el enlace directo a la imagen
  const texto = `🔰 *Aquí tienes la imagen que pediste:*`;

  // Enviar la imagen nuevamente al chat
  await conn.sendMessage(m.chat, { image: imageUrl, caption: texto }, { quoted: m });
};

handler.help = ['ver2'];
handler.tags = ['tools'];
handler.command = ['ver2']; // Comando .ver para ver la imagen nuevamente
export default handler;