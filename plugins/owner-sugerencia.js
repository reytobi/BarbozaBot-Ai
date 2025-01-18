let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, '🌠 ¿Qué comando quieres sugerir?', m);
    if (text.length < 5) return conn.reply(m.chat, '🌠 La sugerencia debe ser más de 5 caracteres.', m);
    if (text.length > 1000) return conn.reply(m.chat, '🌠 El máximo de la sugerencia es de 1000 caracteres.', m);

    const teks = `🌠 Sugerencia de nuevo comando del usuario *${m.sender}*\n\n🛡️ Han sugerido un comando:\n> ${text}`;

    const groupChatId = '120363346831728441@g.us'; // Reemplaza con el ID del grupo correcto
    try {
        // Intentar enviar el mensaje al grupo
        await conn.reply(groupChatId, m.quoted ? teks + '\n' + m.quoted.text : teks, m, { mentions: conn.parseMention(teks) });
        m.reply('🌠 La sugerencia se envió al Staff De BarbozaBot.');
    } catch (error) {
        console.error('Error al enviar el mensaje al grupo:', error);

        // Mensaje de error para el usuario
        m.reply('🌠 Hubo un problema al enviar la sugerencia. Por favor, informa al administrador.');

        // Opcional: Enviar un mensaje al administrador si ocurre un error
        const adminChatId = '123456789@s.whatsapp.net'; // Reemplaza con el ID del administrador
        try {
            const errorReport = `🌠 Error al enviar la sugerencia de *${m.sender}* al grupo:\n\n${error.message}\n\nSugerencia:\n> ${text}`;
            await conn.reply(adminChatId, errorReport, m);
        } catch (adminError) {
            console.error('Error al notificar al administrador:', adminError);
        }
    }
};

handler.help = ['sugerencia'];
handler.tags = ['owner'];
handler.command = ['sugerencia', 'sugerir', 'crowsug'];

export default handler;