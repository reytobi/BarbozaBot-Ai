
const handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply('🚩 Debes escribir un canal y un mensaje para que el bot reaccione.\n📌 Ejemplo: `.reactch canal|Hola callate demasiado`');

  const [channel, message] = args.join(' ').split('|').map(s => s.trim());

  if (!channel || !message) return m.reply('⚠️ Formato incorrecto! Usa: `.reactch canal|Mensaje`');

  try {
    // Buscar el mensaje dentro del canal
    const chat = await conn.groupMetadata(channel);
    const messages = await conn.loadMessages(chat.id, 50); // Carga los últimos 50 mensajes

    const targetMessage = messages.find(m => m.message?.conversation?.includes(message));
    if (!targetMessage) return m.reply('❌ No se encontró el mensaje en el canal.');

    // Enviar reacción
    await conn.sendMessage(channel, {
      react: {
        key: targetMessage.key,
        text: '👍' // Puedes cambiar el emoji
      }
    });

    m.reply(`✅ Se ha reaccionado al mensaje en el canal *${channel}*.`);
  } catch (error) {
    console.error('❌ Error al reaccionar:', error);
    m.reply('⚠️ Ocurrió un error, verifica que el canal y mensaje sean correctos.');
  }
};

handler.command = ['reactch'];
export default handler;