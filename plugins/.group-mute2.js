
import MessageType from '@whiskeysockets/baileys';

const mutedUsers = new Set(); // Conjunto para almacenar usuarios muteados

const handler = async (m, { conn }) => {
  if (m.command === '.mute') {
    if (!m.mentionedJid.length) {
      return conn.sendMessage(m.chat, { text: "Por favor menciona a un usuario para mutear." }, { quoted: m });
    }

    const userToMute = m.mentionedJid[0];

    // Evitar que se mutee al bot
    if (userToMute === conn.user.jid) {
      return conn.sendMessage(m.chat, { text: "No puedes mutear al bot." }, { quoted: m });
    }

    mutedUsers.add(userToMute); // Agregar usuario a la lista de muteados
    conn.sendMessage(m.chat, { text: `El usuario @${userToMute.split('@')[0]} ha sido muteado.` }, { mentions: [userToMute], quoted: m });
  } else if (mutedUsers.has(m.sender)) {
    // Si el mensaje es de un usuario muteado, eliminar el mensaje
    await conn.sendMessage(m.chat, { text: "Mensaje eliminado porque este usuario está muteado." }, { quoted: m });
  }
};

handler.command = /^(mute)$/i;
export default handler;