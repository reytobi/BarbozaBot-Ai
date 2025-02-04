
import fs from 'fs';

const filePath = './mineria.json';

let handler = async (m, { conn, args }) => {
    let who = m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.quoted 
        ? m.quoted.sender 
        : m.sender;

    if (!fs.existsSync(filePath)) {
        return conn.reply(m.chat, '🚫 No hay datos de minería disponibles.', m);
    }

    let data = JSON.parse(fs.readFileSync(filePath));

    if (!data[who]) {
        return conn.reply(m.chat, '⚠️ El usuario no se encuentra en la base de datos de minería.', m);
    }

    // Obtener la cantidad de dulces a sumar desde los argumentos
    const dulcesParaSumar = parseInt(args[0]) || 1; // Por defecto suma 1 si no se proporciona un número

    // Validar que la cantidad sea un número positivo
    if (dulcesParaSumar <= 0) {
        return conn.reply(m.chat, '⚠️ Debes comprar al menos 1 dulce.', m);
    }

    // Sumar los dulces
    data[who].dulces = (data[who].dulces || 0) + dulcesParaSumar;

    // Guardar los cambios en el archivo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    let dulces = data[who].dulces;

    let mensaje = (who === m.sender)
        ? `🎉 *Tu Cartera de Dulces* 🎉\n\n` +
          `🍬 Dulces: *${dulces}*\n\n` +
          `📌 Usa el comando nuevamente mencionando a otro usuario para ver su saldo.`
        : `🎈 *Cartera de @${who.split('@')[0]}* 🎈\n\n` +
          `🍬 Dulces: *${dulces}*`;

    await conn.sendMessage(m.chat, { text: mensaje, mentions: [who] }, { quoted: m });
};

handler.help = ['comprar <cantidad>', 'dulces'];
handler.tags = ['rpg'];
handler.command = ['wallet', 'cartera', 'dulces', 'bal', 'coins'];

export default handler;