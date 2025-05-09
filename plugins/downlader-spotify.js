
import fetch from "node-fetch";

const handler = async (m, { conn, text}) => {
    if (!text) return m.reply("🔍 *Por favor, ingresa el nombre de una canción o artista para buscar en Spotify.*");

    try {
        m.react("🔄");
        let apiUrl = `https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`;
        let respuesta = await (await fetch(apiUrl)).json();

        if (!respuesta ||!respuesta.data) {
            return m.reply("⚠️ *No se encontraron resultados, intenta con otro término.*");
}

        let mensaje = `
🎵 *Título:* ${respuesta.data.title}
👤 *Artista:* ${respuesta.data.artist}
⏳ *Duración:* ${respuesta.data.duration}
🔗 *URL:* ${respuesta.data.url}
`;

        await conn.sendFile(m.chat, respuesta.data.download_url, "spotify.mp3", mensaje, m);
} catch (error) {
        console.error("❌ Error en SpotifyPlay:", error);
        m.reply("⚠️ *Hubo un problema con la descarga, intenta más tarde.*");
}
};

handler.command = ["spotifyplay"];
export default handler;
