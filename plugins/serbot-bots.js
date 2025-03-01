
import fs from 'fs';

async function handler(m, { usedPrefix }) {
    const user = m.sender.split('@')[0];
    const credsPath = `./${jadi}/${user}/creds.json`;

    try {
        if (fs.existsSync(credsPath)) {
            let token = Buffer.from(fs.readFileSync(credsPath), 'utf-8').toString('base64');
            await conn.reply(m.chat, `🍬 *El token te permite iniciar sesión en otros bots, recomendamos no compartirlo con nadie*\n\nTu token es: ${token}`, m);
        } else {
            await conn.reply(m.chat, '🍭 *No tienes ningún token activo, usa #jadibot para crear uno*', m);
        }
    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, '⚠️ *Ocurrió un error al procesar tu solicitud.*', m);
    }
}

handler.help = ['token'];
handler.command = ['token'];
handler.tags = ['serbot'];
handler.private = true;

export default handler;