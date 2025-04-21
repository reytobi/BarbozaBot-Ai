
import fetch from 'node-fetch';

const apis = [
    "https://deliriussapi-oficial.vercel.app/tools/simi?text=",
    "https://vapis.my.id/api/blackbox?q=",
    "https://archive-ui.tanakadomp.biz.id/ai/blackbox?text=",
    "https://api.siputzx.my.id/api/ai/blackboxai-pro?content="
];

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args.length) {
            return m.reply(`❌ Debes proporcionar una pregunta.\n\nEjemplo: *${usedPrefix + command} ¿Cuál es el origen del universo?*`);
        }

        const query = encodeURIComponent(args.join(" "));
        let responseText = null;

        for (let api of apis) {
            try {
                const response = await fetch(api + query);
                if (!response.ok) throw new Error(`❌ API falló: ${api}`);

                const result = await response.json();
                if (result.response) {
                    responseText = result.response;
                    break;
                }
            } catch (err) {
                console.warn(`⚠️ Error en ${api}, probando siguiente API...`);
            }
        }

        if (!responseText) throw new Error("❌ Todas las APIs fallaron.");

        await conn.sendMessage(m.chat, { react: { text: '🤖', key: m.key } });
        await conn.sendMessage(m.chat, { text: responseText }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        m.reply(`❌ Ocurrió un error al procesar tu pregunta.`);
    }
};

handler.command = /^blackboxai$/i;
export default handler;