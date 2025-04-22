
import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args[0]) {
            return m.reply(`❌ Debes proporcionar un enlace de Spotify.\n\nEjemplo: *${usedPrefix + command} https://open.spotify.com/track/ID_DE_CANCION*`);
        }

        const spotifyUrl = encodeURIComponent(args[0]);
        const apiUrl = `https://api.siputzx.my.id/api/d/spotify?url=${spotifyUrl}`;

        await conn.sendMessage(m.chat, { react: { text: '🎵', key: m.key } });

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('❌ Error en la API.');

        const result = await response.json();
        if (!result.audio) throw new Error('❌ No se encontró el audio.');

        await conn.sendMessage(m.chat, {
            audio: { url: result.audio },
            mimetype: 'audio/mpeg',
            fileName: `${result.title || 'Canción'}.mp3`,
            caption: `🎶 *Canción:* ${result.title || 'Desconocido'}\n🎤 *Artista:* ${result.artist || 'Desconocido'}\n📀 *Álbum:* ${result.album || 'Desconocido'}`
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        m.reply(`❌ Ocurrió un error al descargar la canción.`);
    }
};

handler.command = /^spotify$/i;
export default handler;