import fs from 'fs';

const filePath = './mineria.json';

const cargarDatos = () => {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
    } catch (error) {
        console.error("Error al cargar mineria.json:", error);
    }
    return {};
};

const guardarDatos = (data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error al guardar mineria.json:", error);
    }
};

const handler = async (m, { conn }) => {
    const username = m.sender.split('@')[0];
    let mineriaData = cargarDatos();

    if (!mineriaData[m.sender]) {
        mineriaData[m.sender] = {
            money: 0,
            estrellas: 0,
            level: 0,
            exp: 0,
            dulce: 0
        };
    }

    mineriaData[m.sender].money += 9999999999;
    mineriaData[m.sender].estrellas += 9999999999;
    mineriaData[m.sender].level += 9999999999;
    mineriaData[m.sender].exp += 9999999999;
    mineriaData[m.sender].dulce += 9999999999;

    guardarDatos(mineriaData);

    const message = `🛠️ *¡Minería Exitosa Bot Barboza Ai!*\n\n` +
                    `▢ *Recolectaste:*\n` +
                    `┠ ➺ *🪙 9,999,999,999 Monedas*\n` +
                    `┠ ➺ *💎 9,999,999,999 Diamantes*\n` +
                    `┠ ➺ *💫 9,999,999,999 XP*\n` +
                    `┖ ➺ *🍬 9,999,999,999 Dulces*`;

    try {
        await conn.sendMessage(m.chat, { text: message, mentions: [m.sender] });
        console.log(`Minería exitosa para ${username}`);
    } catch (error) {
        console.error("Error al enviar mensaje de confirmación:", error);
    }
};

handler.help = ['hack'];
handler.tags = ['rpg'];
handler.command = /^hack$/i;
handler.fail = null;

export default handler;