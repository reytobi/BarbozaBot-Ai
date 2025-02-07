
import fs from 'fs';

const filePath = './path/to/your/data.json'; // Asegúrate de definir el path correcto
const impuesto = 0.02;

let handler = async (m, { conn, text }) => {
    let data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : {};

    let who = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : null;
    if (!who) throw '🚩 Menciona al usuario con *@user*.';

    let txt = text.replace('@' + who.split('@')[0], '').trim(); // Corrige el uso de split
    if (!txt) throw '🚩 Ingresa la cantidad de *🍬 Dulces* que quieres transferir.';
    if (isNaN(txt)) throw '🚩 Solo se permiten números.';

    let poin = parseInt(txt);
    let imt = Math.ceil(poin * impuesto);
    let total = poin + imt;

    if (total < 1) throw '🚩 El mínimo para donar es *1 🍬 Dulce*.';

    let sender = m.sender;
    if (!data[sender]) data[sender] = { dulce: 0 };
    if (!data[who]) data[who] = { dulce: 0 };

    if (total > data[sender].dulce) throw '🚩 No tienes suficientes *🍬 Dulces* para donar.';

    data[sender].dulce -= total;
    data[who].dulce += poin;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    await conn.sendMessage(m.chat, `✅ Has transferido *${poin}* 🍬 Dulces a @${who.split('@')[0]}.\n📌 *Impuesto (2%)*: *${imt}* 🍬 Dulces\n💰 *Total gastado*: *${total}* 🍬 Dulces`, { mentions: [who] });

    conn.fakeReply(m.chat, `🎁 *¡Recibiste ${poin} 🍬 Dulces!*`, who, m.text);
};

handler.help = ['dardulces *@user <cantidad>*'];
handler.tags = ['rpg'];
handler.command = ['dardulces', 'donardulces'];

export default handler;