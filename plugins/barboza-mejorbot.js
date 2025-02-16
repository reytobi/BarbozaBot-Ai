
import MessageType from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
  try {
    // Verifica si el mensaje contiene el comando '.BarbozaBot'
    if (m.text === '.BarbozaBot') {
      // Responde con el mensaje deseado
      const responseText = "Hola 👋🏻 de .BarbozaBot";
      conn.sendMessage(m.chat, { text: responseText }, { quoted: m });
    }
  } catch (e) {
    console.error(e); // Manejo de errores
  }
};

// Asigna el comando al handler
handler.command = /^\.BarbozaBot$/i;

export default handler;