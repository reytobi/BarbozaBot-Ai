
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';
import fs from 'fs';

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

    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'ruta/a/imagen/https://i.ibb.co/RTBqr4r3/file.jpg'); // Asegúrate de tener una imagen predeterminada
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
`𖤘 *Perfil De Usuario*
❀ *Nombre:* ${username}
❖ *Edad:* ${age}
⚥ *Género:* ${genre}
❀ *Cumpleaños:* ${birth} 
♡ *Casado:* ${isMarried ? partnerName : 'Nadie'}
✎ *Descripción:* ${description}
❍ *Registrado:* ${registered ? '✅': '❌'}

「 ✦ *Recursos - User* 」
✩ *Estrellas:* ${estrellas || 0}
${level || 0}
◭ *Experiencia:* ${exp || 0}
⚡︎ *Rango:* ${role}

> ✧ Para editar tu perfil usa *#perfildates*`.trim();

    let prem =
`╭──⪩ 𝐔𝐒𝐔𝐀𝐑𝐈𝐎 𝐏𝐑𝐄𝐌𝐈𝐔𝐌 ⪨
│⧼👤⧽ *Usuario:* *${username}*
│⧼💠⧽ *Edad:* *${age}*
│⧼⚧️⧽ *Género:* *${genre}*
│⧼🎂⧽ *Cumpleaños:* ${birth}
│⧼👩‍❤️‍👩⧽ *Casado:* ${isMarried ? partnerName : 'Nadie'}
📜 *Descripción:* ${description}
│⧼🌀⧽ *Registrado:* ${registered ? '✅': '❌'}
╰─────────────────⪨

╭────⪩ 𝐑𝐄𝐂𝐔𝐑𝐒𝐎𝐒 ⪨
│⧼💴⧽ *Estrellas:* ${estrellas || 0}
│⧼🌟⧽ *Nivel:* ${level || 0}
│⧼✨⧽ *Experiencia:* ${exp || 0}
│⧼⚜️⧽ *Rango:* ${role}
╰───⪨`.trim();

    conn.sendFile(m.chat, pp, 'perfil.jpg', premium ? prem.trim() : noprem.trim(), m, { mentions: [who] });
}

handler.help = ['profile'];
handler.register = true;
handler.group = false;
handler.tags = ['rg'];
handler.command = ['profile', 'perfil'];
handler.estrellas = 2;

export default handler;