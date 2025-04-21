
import axios from 'axios';
import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import moment from 'moment-timezone';

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    let whe = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
    
    // Obtener el nombre del usuario de manera confiable
    let nameUser = await conn.getName(m.sender);
    let perfil = await conn.profilePictureUrl(whe, 'image').catch(_ => 'https://qu.ax/Mvhfa.jpg');

    // Verificar si el usuario ya está registrado
    if (user.registered) {
        return m.reply(`《★》𝗬𝗮 𝘁𝗲 𝗲𝗻𝗰𝘂𝗲𝗻𝘁𝗿𝗮𝘀 𝗿𝗲𝗴𝗶𝘀𝘁𝗿𝗮𝗱𝗼.\n\n¿𝗤𝘂𝗶𝗲𝗿𝗲 𝘃𝗼𝗹𝘃𝗲𝗿 𝗮 𝗿𝗲𝗴𝗶𝘀𝘁𝗿𝗮𝗿𝘀𝗲?\n\n𝗨𝘀𝗲 𝗲𝘀𝘁𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼 𝗽𝗮𝗿𝗮 𝗲𝗹𝗶𝗺𝗶𝗻𝗮𝗿 𝘀𝘂 𝗿𝗲𝗴𝗶𝘀𝘁𝗿𝗼.\n*${usedPrefix}unreg*`);
    }

    if (!Reg.test(text)) {
        return m.reply(`《★》Eʟ ғᴏʀᴍᴀᴛᴏ ɪɴɢʀᴇsᴀᴅᴏ ᴇs ɪɴᴄᴏʀʀᴇᴄᴛᴏ\n\nUsᴏ ᴅᴇʟ ᴄᴏᴍᴀɴᴅᴏ: ${usedPrefix + command} 𝗻𝗼𝗺𝗯𝗿𝗲.𝗲𝗱𝗮𝗱\nEᴊᴇᴍᴘʟᴏ : *${usedPrefix + command} ${nameUser}.14*`);
    }

    let [_, name, splitter, age] = text.match(Reg);
    if (!name || !age) return m.reply('《★》El nombre y la edad no pueden estar vacíos.');
    if (name.length > 50) return m.reply('《★》El nombre es demasiado largo.');
    
    age = parseInt(age);
    if (age < 5 || age > 100) return m.reply('《★》La edad ingresada es incorrecta.');

    user.name = name.trim();
    user.age = age;
    user.regTime = +new Date();
    user.registered = true;

    let sn = createHash('md5').update(m.sender).digest('hex');

    let regbot = `🎩 *Registro - Bot Barboza*\n`;
    regbot += `💛 *Nombre:* ${name}\n`;
    regbot += `💛 *Edad:* ${age} años\n`;
    regbot += `⌨️ Usa *#perfil* para ver tu información personal.\n`;

    await conn.sendMessage(m.chat, {
        text: regbot,
        contextInfo: {
            externalAdReply: {
                title: '✅ ¡Registro completo!',
                thumbnailUrl: perfil,
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });

    let channelID = '120363414007802886@newsletter';
    let notificationText = `👤 *Usuario registrado*: ${name}\n🎂 *Edad*: ${age} años.\n📥 ¡Nuevo registro!`;

    await conn.sendMessage(channelID, {
        text: notificationText,
        contextInfo: {
            externalAdReply: {
                title: '🔔 Notificación de registro',
                body: 'Nuevo usuario agregado a la base de datos.',
                thumbnailUrl: perfil,
                sourceUrl: 'https://qu.ax/Mvhfa.jpg',
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: null });
};

handler.help = ['reg'];
handler.tags = ['rg'];
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'];

export default handler;