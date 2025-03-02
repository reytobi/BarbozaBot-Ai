
const loadMarriages = () => {
    if (fs.existsSync('./media/database/marry.json')) {
        const data = JSON.parse(fs.readFileSync('./media/database/marry.json', 'utf-8'));
        global.db.data.marriages = data;
    } else {
        global.db.data.marriages = {};
    }
};

var handler = async (m, { conn }) => {
    loadMarriages();

    let who;
    if (m.quoted && m.quoted.sender) {
        who = m.quoted.sender;
    } else {
        who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    }

    // Define una imagen por defecto
    const imagen1 = 'https://i.ibb.co/RTBqr4r3/file.jpg'

    let pp;
    try {
        pp = await conn.profilePictureUrl(who, 'image');
    } catch (_) {
        pp = https://i.ibb.co/RTBqr4r3/file.jpg
    }

    let { premium, level, genre, birth, description, estrellas, exp, lastclaim, registered, regTime, age, role } = global.db.data.users[who] || {};
    let username = conn.getName(who);

    genre = genre === 0 ? 'No especificado' : genre || 'No especificado';
    age = registered ? (age || 'Desconocido') : 'Sin especificar';
    birth = birth || 'No Establecido';
    description = description || 'Sin Descripción';
    role = role || 'Aldeano';
    
    let isMarried = who in global.db.data.marriages;
    let partner = isMarried ? global.db.data.marriages[who] : null;
    let partnerName = partner ? conn.getName(partner) : 'Nadie';

    let noprem =
        `「 𖤘 *Perfil De Usuario* 」
❀ *N᥆mᑲrᥱ:* ${username}
❖ *Eძᥲძ:* ${age}
⚥ *Gᥱᥒᥱr᥆:* ${genre}
❀ *Cᥙm⍴ᥣᥱᥲᥒ‌᥆s:* ${birth} 
♡ *Cᥲsᥲძ@:* ${isMarried ? partnerName : 'Nadie'}
✎ *Dᥱsᥴrі⍴ᥴі᥆‌ᥒ:* ${description}
❍ *Rᥱgіs𝗍rᥲɖo:* ${registered ? '✅': '❌'}`;

    let prem =
        `╭──⪩ 𝐔𝐒𝐔𝐀𝐑𝐈𝐎 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ⪨
│⧼👤⧽ *ᴜsᴜᴀʀɪᴏ:* *${username}*
│⧼💠⧽ *ᴇᴅᴀᴅ:* *${age}*
│⧼⚧️⧽ *ɢᴇɴᴇʀᴏ:* *${genre}*
│⧼🎂⧽ *ᴄᴜᴍᴘʟᴇᴀɴ‌ᴏs:* ${birth}
│⧼👩‍❤️‍👩⧽ *ᴄᴀsᴀᴅᴏ:* ${isMarried ? partnerName : 'Nadie'}
📜 *ᴅᴇsᴄʀɪᴘᴄɪᴏɴ:* ${description}
│⧼🌀⧽ *ʀᴇɡɪsᴛʀᴀᴅᴏ:* ${registered ? '✅': '❌'}

╰─────────────────⪨`;

    conn.sendFile(m.chat, pp, 'perfil.jpg', premium ? prem.trim() : noprem.trim(), m, { mentions: [who] });
}

handler.help = ['profile'];
handler.register = true;
handler.group = false;
handler.tags = ['rg'];
handler.command = ['profile', 'perfil'];
handler.estrellas = 2;

export default handler;
