
import fs from 'fs';

const filePath = './mineria.json';

const leerDatos = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
    }
    return JSON.parse(fs.readFileSync(filePath));
};

const guardarDatos = (datos) => {
    fs.writeFileSync(filePath, JSON.stringify(datos, null, 2));
};

const obtenerDatosUsuario = async (usuarioId) => {
    let usuarios = leerDatos();
    if (!usuarios[usuarioId]) {
        usuarios[usuarioId] = { xp: 0, ultimoReclamo: "" };
        guardarDatos(usuarios);
    }
    return usuarios[usuarioId];
};

const guardarDatosUsuario = async (usuarioId, usuarioData) => {
    let usuarios = leerDatos();
    usuarios[usuarioId] = usuarioData;
    guardarDatos(usuarios);
};

let handler = async (m, { conn }) => {
    const usuarioId = m.sender;
    const xpGanados = 50;

    let usuarioData = await obtenerDatosUsuario(usuarioId);
    const hoy = new Date().toISOString().split('T')[0];

    if (usuarioData.ultimoReclamo === hoy) {
        return conn.sendMessage(m.chat, { text: "¡Ya has reclamado tu XP hoy! Espera hasta mañana para volver a reclamar." }, { quoted: m });
    }

    usuarioData.xp += xpGanados;
    usuarioData.ultimoReclamo = hoy;

    await guardarDatosUsuario(usuarioId, usuarioData);

    const mensajeReclamo = `¡Has reclamado ${xpGanados} XP! 🎉 Ahora tienes ${usuarioData.xp} XP en total.`;
    await conn.sendMessage(m.chat, { text: mensajeReclamo }, { quoted: m });
};

handler.help = ['claim4'];
handler.tags = ['juegos'];
handler.command = ['claim4'];

export default handler;