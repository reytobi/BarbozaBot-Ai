
export async function before(m, { conn, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return true;  
  if (m.isGroup) return false;  
  if (!m.message) return true;  

  const botSettings = global.db.data.settings[this.user.jid] || {};
  
  if (botSettings.antiPrivate && !isOwner && !isROwner) {
    await m.reply(`🚫 *Hola @${m.sender.split`@`[0]}, el uso de mensajes privados no está permitido.*  
❌ *Serás bloqueado automáticamente.*  
✅ *Si necesitas soporte, únete a nuestro grupo oficial!*`, false, { mentions: [m.sender] });

    await conn.updateBlockStatus(m.chat, 'block');
  }

  return false;
}