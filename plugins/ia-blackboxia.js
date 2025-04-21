
import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args.length) {
            return m.reply(`❌ Debes proporcionar una pregunta.\n\nEjemplo: *${usedPrefix + command} ¿Cuál es el origen del universo?*`);
        }

        const query = encodeURIComponent(args.join(" "));
        const apiUrl = `https://vapis.my.id/api/blackbox?q=${query}`;

        await conn.sendMessage(m.chat, { react: { text: '🤖', key: m.key } });

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('❌ Error en la API.');
        const result = await response.json();

        await conn.sendMessage(m.chat, { text: result.response }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        m.reply(`❌ Ocurrió un error al procesar tu pregunta.`);
    }
};

handler.command = /^blackboxai$/i;
export default handler;