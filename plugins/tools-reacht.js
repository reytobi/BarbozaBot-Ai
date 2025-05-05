
const handler = async (m, { conn, args }) => { // Se añade args en los parámetros
    if (!args || args.length < 2) return m.reply(`🚩 *Ejemplo correcto:* \n.channelReact https://whatsapp.com/channel/xxxx hola`);

    if (!args[0].startsWith("https://whatsapp.com/channel/")) return m.reply("❌ *Link no válido.*");

    const hurufGaya = {
        a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
        h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
        o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
        v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
        '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
        '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
    };

    const emojiInput = args.slice(1).join(' ').toLowerCase();
    const emoji = emojiInput.split('').map(c => hurufGaya[c] || c).join('');

    try {
        const link = args[0];
        const parts = link.split('/');
        
        if (parts.length < 6) return m.reply("❌ *Error: Enlace incompleto.*");

        const channelId = parts[4];
        const messageId = parts[5];

        const res = await conn.newsletterMetadata("invite", channelId);
        await conn.newsletterReactMessage(res.id, messageId, emoji);

        return m.reply(`✅ *Reacción ${emoji} enviada exitosamente en el canal ${res.name}!*`);
    } catch (e) {
        console.error(e);
        return m.reply("⚠️ *Error al enviar la reacción. Verifica el enlace y el emoji.*");
    }
};

handler.command = /^(React)$/i;
export default handler;