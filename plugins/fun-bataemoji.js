
const handler = async (m, { conn}) => {
    const emojis = ["🔥", "⚡", "💎", "🛡️", "⚔️", "🎭", "👑"];
    const usuarioEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const botEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    let resultado = "🤔 *Empate!* Ambos eligieron emojis similares.";
    if ((usuarioEmoji === "🔥" && botEmoji === "🛡️") ||
        (usuarioEmoji === "⚔️" && botEmoji === "👑") ||
        (usuarioEmoji === "💎" && botEmoji === "🔥")) {
        resultado = "🎉 *Ganaste!* Tu emoji venció al del bot.";
} else if ((botEmoji === "🔥" && usuarioEmoji === "🛡️") ||
               (botEmoji === "⚔️" && usuarioEmoji === "👑") ||
               (botEmoji === "💎" && usuarioEmoji === "🔥")) {
        resultado = "😢 *Perdiste!* El emoji del bot fue más fuerte.";
}

    let mensaje = `🎭 *Batalla de Emoji* 🎭\n\n👤 *Tú elegiste:* ${usuarioEmoji}\n🤖 *Bot eligió:* ${botEmoji}\n\n${resultado}`;

    await conn.sendMessage(m.chat, { text: mensaje});
};

handler.command = ["bataemoji"];
export default handler;
