import yts from "yt-search";

let youtubeSessions = new Map();

const youtubeHandler = async (m, { conn, command, args, usedPrefix }) => {
    let query = args.join(' ').trim();

    let session = youtubeSessions.get(m.chat) || {
        videos: [],
        currentIndex: 0,
        query: query || ''
    };

    if (command === 'ytsearch') {
        if (!query) {
            return conn.reply(
                m.chat,
                `❌ Escribe lo que quieres buscar\nEjemplo: ${usedPrefix}ytsearch Never Gonna Give You Up`,
                m
            );
        }

        session = { videos: [], currentIndex: 0, query: query };
        youtubeSessions.set(m.chat, session);

        try {
            const searchResults = await yts(query);
            const videos = searchResults.videos.slice(0, 10);

            if (!videos.length) {
                return conn.reply(m.chat, '❌ No se encontraron videos', m);
            }

            session.videos = videos;
            youtubeSessions.set(m.chat, session);

            return await sendVideoWithButtons(session, m, conn, usedPrefix);
        } catch (error) {
            console.error(error);
            return conn.reply(m.chat, '❌ Error al buscar videos', m);
        }
    }

    if (command === 'ytseguir') {
        if (!session.videos.length) {
            return conn.reply(m.chat, '❌ Primero usa .ytsearch para buscar videos', m);
        }

        session.currentIndex = (session.currentIndex + 1) % session.videos.length;
        youtubeSessions.set(m.chat, session);
        return await sendVideoWithButtons(session, m, conn, usedPrefix);
    }
};

async function sendVideoWithButtons(session, m, conn, usedPrefix) {
    const video = session.videos[session.currentIndex];

    const caption = `
🎥 *Video ${session.currentIndex + 1} de ${session.videos.length}*
━━━━━━━━━━━━━━━━
📌 *Título*: ${video.title}
⏱️ *Duración*: ${video.timestamp}
👀 *Vistas*: ${video.views}
🔗 *Enlace*: [Ver en YouTube](${video.url})
`.trim();

    try {
        const buttons = [
            {
                buttonId: `${usedPrefix}ytmp3 ${encodeURIComponent(video.url)}`,
                buttonText: { displayText: "🎵 Descargar Audio" },
                type: 1
            },
            {
                buttonId: `${usedPrefix}ytmp4 ${encodeURIComponent(video.url)}`,
                buttonText: { displayText: "🎥 Descargar Video" },
                type: 1
            }
        ];

        if (session.videos.length > 1) {
            buttons.push({
                buttonId: `${usedPrefix}ytseguir`,
                buttonText: { displayText: "➡️ Siguiente" },
                type: 1
            });
        }

        await conn.sendMessage(
            m.chat,
            {
                image: { url: video.image },
                caption: caption,
                buttons: buttons,
                viewOnce: true
            },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Error al enviar el video', m);
    }
}

youtubeHandler.help = ['ytsearch <búsqueda>', 'ytseguir'];
youtubeHandler.tags = ['search', 'tools'];
youtubeHandler.command = /^(ytsearch|ytseguir)$/i;

export default youtubeHandler;