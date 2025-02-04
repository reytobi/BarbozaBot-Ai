import fs from 'fs';

const filePath = './mineria.json';

let handler = async (m, { conn }) => {
    let who = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : m.sender;

    if (!fs.existsSync(filePath)) {
        return conn.reply(m.chat, '🚫 No hay datos de minería disponibles.', m);
    }

    let data;
    try {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.error('❌ Error al leer el archivo JSON:', error);
        return conn.reply(m.chat, '⚠️ Hubo un error al leer los datos de minería.', m);
    }

    if (!data[who]) {
        return conn.reply(m.chat, '⚠️ El usuario no se encuentra en la base de datos de minería.', m);
    }

    let dulces = data[who]?.dulces ?? 0; // Si no hay dulces, usa 0

    let mensaje = (who === m.sender)
        ? `🎉 *Tu Cartera de Dulces* 🎉\n\n` +
          `🍬 Dulces: *${dulces}*\n\n` +
          `📌 Usa el comando mencionando a otro usuario para ver su saldo.`
        : `🎈 *Cartera de @${who.split('@')[0]}* 🎈\n\n` +
          `🍬 Dulces: *${dulces}*`;

    await conn.sendMessage(m.chat, { text: mensaje, mentions: [who] }, { quoted: m });
};

handler.help = ['dulces'];
handler.tags = ['rpg'];
handler.command = ['dulces', 'cartera', 'wallet'];

export default handler;