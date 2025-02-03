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

    mineriaData[m.sender].money = 9999999999;
    mineriaData[m.sender].estrellas = 9999999999;
    mineriaData[m.sender].level = 9999999999;
    mineriaData[m.sender].exp = 9999999999;
    mineriaData[m.sender].dulce = 9999999999;

    guardarDatos(mineriaData);

    const message = `🚩 *@${username}* Ahora tienes 9,999,999,999 en todos los recursos.`;
    
    try {
        await conn.sendMessage(m.chat, { text: message, mentions: [m.sender] });
        console.log(`Recursos aumentados para ${username}`);
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