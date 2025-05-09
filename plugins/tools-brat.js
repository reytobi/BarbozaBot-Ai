
import fetch from "node-fetch";

const handler = async (m, { conn, text}) => {
    if (!text) return m.reply("🖋️ *Por favor, ingresa el texto que deseas convertir en sticker.*");

    try {
        m.react("🔄");
        let apiUrl = `https://vapis.my.id/api/bratv1?q=${encodeURIComponent(text)}`;
        let respuesta = await (await fetch(apiUrl)).json();

        if (!respuesta ||!respuesta.data ||!respuesta.data.sticker_url) {
            return m.reply("⚠️ *No se pudo generar el sticker, intenta con otro texto.*");
}

        await conn.sendFile(m.chat, respuesta.data.sticker_url, "sticker.webp", "", m, { asSticker: true});
} catch (error) {
        console.error("❌ Error al generar sticker:", error);
        m.reply("⚠️ *Hubo un problema, intenta más tarde.*");
}
};

handler.command = ["brat"];
export default handler;