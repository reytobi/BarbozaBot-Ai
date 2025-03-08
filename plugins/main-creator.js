import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn }) { 
    let numcreador = '584146277368';
    let ownerJid = numcreador + '@s.whatsapp.net';

    let name = await conn.getName(ownerJid) || 'Barboza'; 
    let about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || 'Sin descripción';

    let empresa = 'Barboza - Servicios Tecnológicos';

    let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
ORG:${empresa};
TITLE:CEO & Fundador
TEL;waid=${numcreador}:${new PhoneNumber('+' + numcreador).getNumber('international')}
EMAIL:correo@empresa.com
URL:https://www.tuempresa.com
NOTE:${about}
ADR:;;Dirección de tu empresa;;;;
X-ABADR:ES
X-ABLabel:Dirección Web
X-ABLabel:Correo Electrónico
X-ABLabel:Teléfono de contacto
X-WA-BIZ-NAME:${name}
X-WA-BIZ-DESCRIPTION:${about}
END:VCARD`.trim();

    let buttons = [
        { buttonId: '.perfil', buttonText: { displayText: '📌 Perfil' }, type: 1 },
        { buttonId: '.menu', buttonText: { displayText: '📜 Menú' }, type: 1 }
    ];

    let buttonMessage = {
        contacts: { 
            displayName: name, 
            contacts: [{ vcard }]
        },
        caption: `👤 *${name}* - CEO & Fundador\n📝 *Descripción:* ${about}`,
        footer: 'Barboza - Servicios Tecnológicos',
        buttons: buttons,
        headerType: 6 
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
}

handler.help = ['owner']; 
handler.tags = ['main']; 
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;