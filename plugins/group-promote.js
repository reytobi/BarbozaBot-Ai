let handler = async (m, { conn, usedPrefix, command, text }) => {
    let number;
    if (isNaN(text) && !text.match(/@/g)) {
        return conn.reply(m.chat, `🚩 Menciona a una persona.`, m, rcanal);
    } else if (isNaN(text)) {
        number = text.split`@`[1];
    } else {
        number = text;
    }

    if (!text && !m.quoted) return conn.reply(m.chat, `🚩 Menciona a una persona.`, m, rcanal);
    if (number.length > 13 || (number.length < 11 && number.length > 0)) return conn.reply(m.chat, `🚩 Menciona a una persona.`, m, rcanal);

    try {
        let user;
        if (text) {
            user = number + '@s.whatsapp.net';
        } else if (m.quoted && m.quoted.sender) {
            user = m.quoted.sender;
        } else if (m.mentionedJidList.length > 0) {
            user = m.mentionedJidList[0]; // Asegúrate de que haya al menos un mencionado
        }
let username = conn.getName(who);

        if (!user) return conn.reply(m.chat, `🚩 Menciona a una persona válida.`, m, rcanal);

        await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
        await conn.reply(m.chat, `*[ ☃️ ] @${user.split('@')[0]} Fue promovido a administrador.*`, m, rcanal);
        await m.react('✅');
    } catch (e) {
        console.error(e); // Registra el error
    }
}

handler.help = ['promote *@user*'];
handler.tags = ['group'];
handler.command = ['promote', 'promover', 'daradmin'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;