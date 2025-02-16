
import { MessageType } from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
  try {
    // Verifica si el mensaje contiene el comando '.BarbozaBot'
    if (m.text && m.text.toLowerCase() === '.barbozabot') {
      const responseText = "Hola 👋🏻 de .BarbozaBot";
      conn.sendMessage(m.chat, { text: responseText }, { quoted: m });
    }

    // Verifica si el mensaje contiene el comando 'Barboza power'
    if (m.text && m.text.toLowerCase() === 'barboza power') {
      const responseTextPower = "¡Barboza power activado! ⚡️💪";
      conn.sendMessage(m.chat, { text: responseTextPower }, { quoted: m });
    }
  } catch (e) {
    console.error(e); // Manejo de errores
  }
};

// Asigna el comando al handler
handler.command = /^\.barbozabot$|^barboza power$/i;

export default handler;