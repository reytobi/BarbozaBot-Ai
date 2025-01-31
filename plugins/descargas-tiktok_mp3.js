import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        throw m.reply(`*🦅 Ejemplo: ${usedPrefix + command}* https://vm.tiktok.com/ZMhAk8tLx/`);
    }

    try {
        await conn.reply(m.chat, "🌷 *Espere un momento, estoy descargando su audio...*", m);

        const tiktokData = await tiktokdl(args[0]);

        // Validar si la respuesta de la API es correcta
        if (!tiktokData || !tiktokData.data || !tiktokData.data.music) {
            throw new Error("❌ *Error:* No se pudo obtener el audio. Verifica el enlace o intenta más tarde.");
        }

        const { music, title, create_time, digg_count, comment_count, share_count, play_count, download_count, author } = tiktokData.data;

        const infonya_gan = `*📖 Descripción:* ${title}\n*🚀 Publicado:* ${create_time}\n\n*⚜️ Estado:*\n=====================\nLikes = ${digg_count}\nComentarios = ${comment_count}\nCompartidas = ${share_count}\nVistas = ${play_count}\nDescargas = ${download_count}\n=====================\n\nUploader: ${author.nickname || "No info"}\n(${author.unique_id} - https://www.tiktok.com/@${author.unique_id})\n*🔊 Sonido:* ${music}\n`;

        // Enviar el audio como archivo MP3 (no como nota de voz)
        await conn.sendMessage(
            m.chat,
            {
                audio: { url: music },
                mimetype: "audio/mp3",
                fileName: "tiktok_audio.mp3",
                ptt: false // Esto evita que WhatsApp lo interprete como nota de voz
            },
            { quoted: m }
        );

        await conn.reply(m.chat, "`🎶 AUDIO DESCARGADO DE TIKTOK`" + `\n\n${infonya_gan}`, m);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `❌ *Error:* ${error.message || "No se pudo procesar la solicitud."}`, m);
    }
};

handler.help = ['ttmp3', 'tiktokmp3'];
handler.tags = ['descargas'];
handler.command = /^ttmp3|tiktokmp3$/i;

handler.disable = false;
handler.register = true;
handler.limit = true;

export default handler;

async function tiktokdl(url) {
    try {
        let apiUrl = `https://www.tikwm.com/api/?url=${url}&hd=1`;
        let response = await fetch(apiUrl);
        let json = await response.json();

        if (!json || !json.data) {
            throw new Error("❌ La API no devolvió una respuesta válida.");
        }

        return json;
    } catch (error) {
        console.error("Error en la función tiktokdl:", error);
        return null;
    }
}