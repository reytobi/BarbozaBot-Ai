
import fetch from "node-fetch";

// Función para obtener información de TikTok
const obtenerTikTok = async (query) => {
    try {
        const apiUrl = `https://api.siputzx.my.id/api/s/tiktok?query=${encodeURIComponent(query)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status && data.data && data.data.length> 0) {
            return data.data.slice(0, 5); // Retorna los primeros 5 resultados
}
        return null;
} catch (error) {
        console.error("❌ Error al obtener videos de TikTok:", error);
        return null;
}
};

// Handler para procesar la solicitud del usuario
const handler = async (m, { conn, text}) => {
    if (!text) {
        return m.reply("🔍 *Por favor, ingresa el nombre del video de TikTok.*");
}

    m.react("⏳");

    const resultados = await obtenerTikTok(text);

    if (resultados) {
        m.reply(`✅ *Se encontraron ${resultados.length} videos de TikTok.* Enviando ahora...`);

        for (const resultado of resultados) {
            let mensaje = `
🎥 *Título:* ${resultado.title}
📅 *Fecha:* ${resultado.date}

👤 *Autor:*
- 🏷️ *Nombre:* ${resultado.author.nickname}
- ✨ *Username:* @${resultado.author.unique_id}
`;

            await conn.sendFile(m.chat, resultado.play, "tiktok.mp4", mensaje, m);
}
} else {
        m.reply("⚠️ *No se encontraron resultados, intenta con otro término.*");
}
};

handler.command = ["tik"];
export default handler;