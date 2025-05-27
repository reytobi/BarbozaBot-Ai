
let handler = async (m, { conn, participants, usedPrefix, command, isROwner }) => {
    let kickte = `🚩 Menciona al usuario que deseas eliminar.`;

    // Verifica que el usuario mencionado o citado exista
    if (!m.mentionedJid[0] && !m.quoted) {
        return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte) });
    }

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;
    let owr = m.chat.split`-`[0];

    // Verifica si el miembro que invoca el comando es admin y si el bot también es admin
    if (!participants.find(p => p.id === m.sender && p.isAdmin) || !participants.find(p => p.id === conn.user.jid && p.isAdmin)) {
        return m.reply(`🚩 Solo los administradores pueden usar este comando.`);
    }
    
    // Eliminar al usuario
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
    m.reply(`🚩 Usuario eliminado.`);
};

handler.help = ['kick *@user*'];
handler.tags = ['group'];
handler.command = ['kick', 'expulsar']; 
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;