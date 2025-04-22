
import fetch from 'node-fetch';

const apis = [
    "https://api.siputzx.my.id/api/d/spotify?url=",
    "https://api.diioffc.web.id/api/download/spotify?url="
];

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args[0]) {
            return m.reply(`❌ Debes proporcionar un enlace de Spotify.\n\nEjemplo: *${usedPrefix + command} https://open.spotify.com/track/ID_DE_CANCION*`);
        }

        const spotifyUrl = encodeURIComponent(args[0]);
        let responseJson = null;

        for (let api of apis) {
            try {
                const response = await fetch(api + spotifyUrl);
                if (!response.ok) throw new Error(`❌ API falló: ${api}`);

                responseJson = await response.json();
                if (responseJson.audio) break;
            } catch (err) {
                console.warn(`⚠️ Error en ${api}, probando siguiente API...`);
            }
        }

        if (!responseJson || !responseJson.audio) throw new Error("❌ Todas las APIs fallaron al obtener el audio.");

        const detailsText = `🎶 *Detalles de la canción:*\n👤 *Título:* ${responseJson.title || 'Desconocido'}\n🎤 *Artista:* ${responseJson.artist || 'Desconocido'}\n📀 *Álbum:* ${responseJson.album || 'Desconocido'}\n💽 *Audio disponible:* Sí`;

        await conn.sendMessage(m.chat, { text: detailsText }, { quoted: m });

        await conn.sendMessage(m.chat, {
            audio: { url: responseJson.audio },
            mimetype: 'audio/mpeg',
            fileName: `${responseJson.title || 'Canción'}.mp3`,
            caption: `🎶 Aquí tienes la canción.\n🌟 ¡Disfrútala!`
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        m.reply(`❌ Ocurrió un error al descargar la canción.`);
    }
};

handler.command = /^spotify$/i;
export default handler;