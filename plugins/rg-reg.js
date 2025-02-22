import { createHash } from 'crypto';

const Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const user = global.db.data.users[m.sender];
    const name2 = conn.getName(m.sender);
    const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender;
    
    let pp;
    try {
        pp = await conn.profilePictureUrl(who, 'image');
    } catch {
        pp = null; // Si no se puede obtener la imagen, evitar error
    }

    if (user.registered === true) {
        throw `*⚠️ Ya estás registrado*\n\n¿Quieres volver a registrarte?\n\n💬 Usa *${usedPrefix}unreg <Número de serie>* para eliminar tu registro.`;
    }

    if (!Reg.test(text)) {
        throw `*⚠️ Formato incorrecto*\n\n📝 Uso: *${usedPrefix + command} nombre.edad*\n💡 Ejemplo: *${usedPrefix + command}* ${name2}.18`;
    }

    const [_, name, splitter, age] = text.match(Reg);
    
    if (!name) throw '*📝 El nombre no puede estar vacío*';
    if (!age) throw '*📝 La edad no puede estar vacía*';
    if (name.length >= 30) throw '*⚠️ El nombre es demasiado largo*';
    
    const ageInt = parseInt(age);
    if (ageInt > 100) throw '*👴🏻 Wow, el abuelo quiere jugar con el bot*';
    if (ageInt < 5) throw '*👀 Hay un bebé usando el bot*';

    user.name = name.trim();
    user.age = ageInt;
    user.regTime = +new Date();
    user.registered = true;
    user.limit = (user.limit || 0) + 10;

    const sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6);
    m.react('📩');

    const regMessage = `🗃️ *R E G I S T R A D O* 🗃️\n\n💌 *Nombre:* ${name}\n📆 *Edad:* ${ageInt} años\n🍬 *Dulces añadidos:* 10\n\n👇 *Presiona el botón para ver el menú* 👇`;

    const buttons = [
        {
            buttonId: `${usedPrefix}menu`,
            buttonText: { displayText: '📜 Menú' },
            type: 1
        }
    ];

    const buttonMessage = {
        caption: regMessage,
        footer: '✨ Registro exitoso',
        buttons: buttons,
        headerType: 1
    };

    if (pp) {
        // Si hay imagen de perfil, la envía junto con el mensaje
        await conn.sendMessage(m.chat, { image: { url: pp }, ...buttonMessage }, { quoted: m });
    } else {
        // Si no hay imagen de perfil, envía solo el texto y botones
        await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
    }
};

handler.help = ['reg'];
handler.tags = ['rg'];
handler.command = ['verify', 'reg', 'verificar'];

export default handler;