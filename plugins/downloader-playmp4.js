
import fetch from "node-fetch";

const handler = async (m, { conn, text}) => {
    if (!text) return m.reply("🔎 *Por favor, ingresa el nombre de un video o una URL de YouTube.*");

    try {
        m.react("🔄");
        let apiUrl = `https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(text)}`;
        let respuesta = await (await fetch(apiUrl)).json();

        if (!respuesta ||!respuesta.data) {
            return m.reply("⚠️ *No se encontraron resultados, intenta con otro término.*");
}

        let mensaje = `
🎥 *Título:* ${respuesta.data.title}
⏳ *Duración:* ${respuesta.data.duration}
👀 *Vistas:* ${respuesta.data.views}
🔗 *URL:* ${respuesta.data.url}
`;

        await conn.sendFile(m.chat, respuesta.data.download_url, "video.mp4", mensaje, m);
} catch (error) {
        console.error("❌ Error en Play2:", error);
        m.reply("⚠️ *Hubo un problema con la descarga, intenta más tarde.*");
}
};

handler.command = ["play2"];
export default handler;