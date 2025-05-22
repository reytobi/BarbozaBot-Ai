
import baileys from '@whiskeysockets/baileys';

const WAMessageStubType = baileys.default;

export async function before(m, { conn, participants, groupMetadata}) {
  if (!m.messageStubType ||!m.isGroup) return;

  const fkontak = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Halo"
},
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:y
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:Ponsel
END:VCARD`
}
},
    "participant": "0@s.whatsapp.net"
};

  let chat = global.db.data.chats[m.chat];
  let usuario = `@${m.sender.split`@`[0]}`;
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg';

  let nombre = `
🔹🔸 *¡ALERTA DE GRUPO!* 🔸🔹
👤 *Usuario:* ${usuario}
🆕 *Nuevo nombre:* ${m.messageStubParameters[0]}
📢 ¡Cambio detectado!`;

  let foto = `
🖼️ *ACTUALIZACIÓN DE IMAGEN*
👤 *Usuario:* ${usuario}
📸 ¡Se ha cambiado la foto del grupo!`;

  let edit = `
⚙️ *CONFIGURACIÓN MODIFICADA*
👤 *Usuario:* ${usuario}
🔒 Nueva configuración: ${m.messageStubParameters[0] == 'on'? 'Solo administradores': 'Todos'}`;

  let newlink = `
🔗 *ENLACE DEL GRUPO RESTABLECIDO*
👤 *Usuario:* ${usuario}
🌐 ¡El grupo tiene un nuevo enlace!`;

  let status = `
🚪 *CAMBIO EN EL ESTADO DEL GRUPO*
👤 *Usuario:* ${usuario}
🔓 Estado actual: ${m.messageStubParameters[0] == 'on'? 'Cerrado 🔒': 'Abierto 🔓'}`;

  let admingp = `
👑 *ASCENSO A ADMINISTRADOR*
📌 *Nuevo admin:* ${m.messageStubParameters[0].split`@`[0]}
🛠️ *Acción realizada por:* ${usuario}`;

  let noadmingp = `
⚠️ *REMOCIÓN DE ADMINISTRADOR*
📌 *Usuario afectado:* ${m.messageStubParameters[0].split`@`[0]}
📉 *Cambio realizado por:* ${usuario}`;

  if (chat.detect && m.messageStubType == 21) {
    await conn.sendMessage(m.chat, { text: nombre, mentions: [m.sender]}, { quoted: fkontak});
} else if (chat.detect && m.messageStubType == 22) {
    await conn.sendMessage(m.chat, { image: { url: pp}, caption: foto, mentions: [m.sender]}, { quoted: fkontak});
} else if (chat.detect && m.messageStubType == 23) {
    await conn.sendMessage(m.chat, { text: newlink, mentions: [m.sender]}, { quoted: fkontak});
} else if (chat.detect && m.messageStubType == 25) {
    await conn.sendMessage(m.chat, { text: edit, mentions: [m.sender]}, { quoted: fkontak});
} else if (chat.detect && m.messageStubType == 26) {
    await conn.sendMessage(m.chat, { text: status, mentions: [m.sender]}, { quoted: fkontak});
} else if (chat.detect && m.messageStubType == 29) {
    await conn.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`]}, { quoted: fkontak});
} else if (chat.detect && m.messageStubType == 30) {
    await conn.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`]}, { quoted: fkontak});
}
}