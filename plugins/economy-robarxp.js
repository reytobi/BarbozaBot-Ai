
let handler = async (m, { conn, args }) => {
    let who = m.mentionedJidList[0] || m.chat; // Se usa el usuario mencionado o el propio chat
    if (!who) {
        conn.reply(m.chat, "👤 𝑬𝒕𝒊𝒒𝒖𝒆𝒕𝒂 𝒂 𝒂𝒍𝒈𝒖𝒊𝒆𝒏 𝒑𝒂𝒓𝒂 2800000000e 2800000000e 2800000000e 2800000000e 2800000000e 2800000000e 2800000000e 😕.", m);
        return;
    }
    if (!(who in global.db.data.users)) {
        conn.reply(m.chat, "👤 𝑬𝒍 𝒖𝒔𝒖𝒂𝒓𝒊𝒐 𝒏𝒐 𝒔𝒆 2800000000e 2800000000e 2800000000e 😕.", m);
        return;
    }

    const users = global.db.data.users[who];
    const robAmount = Math.floor(Math.random() * (users.sweets / 2)); // Robar hasta la mitad de los dulces del usuario
    if (users.sweets < robAmount) {
        return conn.reply(m.chat, `😔 @${who.split('@')[0]} no tiene suficientes dulces para robar.`, m, { mentions: [who] });
    }

    global.db.data.users[m.sender].sweets += robAmount;
    global.db.data.users[who].sweets -= robAmount;

    conn.reply(m.chat, `✨ Robaste ${robAmount} dulces a @${who.split('@')[0]}!`, m, { mentions: [who] });
};

handler.help = ['rob', 'robar'];
handler.tags = ['economy'];
handler.command = ['rob', 'robar'];

export default handler;