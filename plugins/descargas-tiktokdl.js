
import fetch from 'node-fetch';

const handler = async (m, { conn, args}) => {
    if (!args[0]) return conn.reply(m.chat, '❌ *Debes proporcionar un enlace de TikTok!*', m);

    const apiUrl = `https://api.nekorinn.my.id/downloader/tikwm?url=${encodeURIComponent(args[0])}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.video && data.video.url) {
            await conn.sendMessage(m.chat, {
                video: { url: data.video.url},
                caption: `✅ *Descarga completada!* 🎥\n🔗 *Fuente:* ${args[0]}`,
});
} else {
            await conn.reply(m.chat, '⚠️ *Error al procesar la descarga. Intenta con otro enlace.*', m);
}
} catch (error) {
        await conn.reply(m.chat, '❌ *Hubo un problema con la API. Inténtalo más tarde.*', m);
        console.error(error);
}
};

handler.command = ["tiktokdl"];
export default handler;