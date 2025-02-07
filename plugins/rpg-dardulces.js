
import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  try {
    const user = m.mentionedJid[0]; // Usuario que recibe los dulces
    const amount = parseInt(text.split(' ')[1]) || 1; // Cantidad de dulces a regalar

    if (!user) {
      return conn.sendMessage(m.chat, 'Por favor, menciona a un usuario al que quieras regalar dulces usando @usuario.', { quoted: m });
    }

    if (isNaN(amount) || amount <= 0) {
      return conn.sendMessage(m.chat, 'Por favor, especifica una cantidad válida de dulces.', { quoted: m });
    }

    // Aquí se puede agregar la lógica para actualizar la cartera de dulces
    await updateCandyWallet(user, amount);

    const message = `🍬 *${conn.getName(m.sender)}* ha regalado ${amount} dulces a *${conn.getName(user)}*! 🍬`;
    
    // Mencionar al usuario que recibe los dulces
    conn.sendMessage(m.chat, { text: message, mentions: [user] }, { quoted: m });
  } catch (e) {
    console.error(e);
    conn.sendMessage(m.chat, 'Ocurrió un error al tratar de regalar los dulces.', { quoted: m });
  }
};

// Función para actualizar la cartera de dulces (debes implementarla)
const updateCandyWallet = async (user, amount) => {
  // Aquí iría la lógica para sumar los dulces a la cartera del usuario.
  // Por ejemplo, podrías hacer una llamada a tu base de datos para actualizar la cantidad de dulces.
};

handler.command = /^\.dardulces$/i;
export default handler;