
import fetch from "node-fetch";

const handler = async (m, { conn, text}) => {
    if (!text) return m.reply("🔎 *Por favor, ingresa una palabra clave para buscar en TikTok.*");

    try {
        m.react("🔄");
        let apiUrl = `https://api.vreden.my.id/api/search/tiktok?query=${encodeURIComponent(text)}`;
        let respuesta = await (await fetch(apiUrl)).json();

        if (!respuesta ||!respuesta.data || respuesta.data.length === 0) {
            return m.reply("⚠️ *No se encontraron resultados. Intenta con otro término.*");
}

        let mensaje = "📱 *Resultados de TikTok:* 📱\n";
        respuesta.data.slice(0, 5).forEach((video, index) => {
            mensaje += `\n🔹 ${index + 1}. *${video.title}* \n👤 ${video.author} \n🔗 ${video.url}`;
});

        await conn.sendMessage(m.chat, { text: mensaje});
} catch (e) {
        m.reply("❌ *Error al obtener resultados de TikTok. Inténtalo más tarde.*");
}
};

handler.help = ["tiktoksearch"];
handler.tags = ["tiktok"];
handler.command = ["tiktoksearch", "buscarTikTok"];

export default handler;