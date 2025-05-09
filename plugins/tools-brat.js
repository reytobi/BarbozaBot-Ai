
import fetch from "node-fetch";

const handler = async (m, { conn, args, usedPrefix}) => {
    try {
        if (!args[0]) {
            return m.reply(`🖋️ *Por favor, ingresa el texto que deseas convertir en sticker.*\n\n📌 Ejemplo: ${usedPrefix}bratsticker Hola mundo!`);
}

        const text = encodeURIComponent(args.join(" "));
        const apiUrl = `https://api.nekorinn.my.id/maker/brat-v2?text=${text}`;

        // Reacción de espera
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key}});

        // Obtener el sticker
        const stickerResponse = await fetch(apiUrl);
        const json = await stickerResponse.json();
        if (!json ||!json.url) throw new Error("Error al generar el sticker");

        // Enviar el sticker
        await conn.sendFile(m.chat, json.url, "sticker.webp", "", m, { asSticker: true});

        // Reacción de éxito
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key}});

} catch (err) {
        console.error("❌ Error al generar el sticker:", err);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key}});
        await m.reply("⚠️ *Hubo un problema al crear el sticker, intenta más tarde.*");
}
};

handler.command = ["brat"];
export default handler;