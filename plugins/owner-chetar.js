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

const handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return m.reply("❌ Solo el owner puede usar este comando.");

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

    mineriaData[m.sender].money = Infinity;
    mineriaData[m.sender].estrellas = Infinity;
    mineriaData[m.sender].level = Infinity;
    mineriaData[m.sender].exp = Infinity;
    mineriaData[m.sender].dulce = Infinity;

    guardarDatos(mineriaData);

    const message = `🚩 *@${username}* Ahora tienes recursos ilimitados.`;
    
    try {
        await conn.sendMessage(m.chat, { text: message, mentions: [m.sender] });
        console.log(`Recursos cheteados para ${username}`);
    } catch (error) {
        console.error("Error al enviar mensaje de confirmación:", error);
    }
};

handler.help = ['cheat'];
handler.tags = ['owner'];
handler.command = /^(ilimitado|infinity|chetar)$/i;
handler.rowner = true;
handler.fail = null;

export default handler;