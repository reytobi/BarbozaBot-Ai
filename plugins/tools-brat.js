
import fetch from "node-fetch";

const handler = async (m, { conn, text}) => {
    if (!text) return m.reply("🔍 *Por favor, ingresa un término de búsqueda para consultar en Brat.*");

    try {
        m.react("🔄");
        let apiUrl = `https://vapis.my.id/api/bratv1?q=${encodeURIComponent(text)}`;
        let respuesta = await (await fetch(apiUrl)).json();

        if (!respuesta ||!respuesta.data) {
            return m.reply("⚠️ *No se encontraron resultados, intenta con otro término.*");
}

        let mensaje = `
🔥 *Resultados de Brat:* 🔥
📌 *Título:* ${respuesta.data.title}
🔗 *Fuente:* ${respuesta.data.source}
📅 *Fecha:* ${respuesta.data.date}
📜 *Descripción:* ${respuesta.data.description}
`;

        await conn.sendMessage(m.chat, { text: mensaje});
} catch (error) {
        console.error("❌ Error en la consulta de Brat:", error);
        m.reply("⚠️ *Hubo un problema con la consulta, intenta más tarde.*");
}
};

handler.command = ["bratsearch"];
export default handler;