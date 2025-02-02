let usuarios = {}; 

const obtenerDatosUsuario = async (usuarioId) => {
    if (!usuarios[usuarioId]) {
        usuarios[usuarioId] = { dulces: 0, ultimoReclamo: "" };
    }
    return usuarios[usuarioId];
};

const guardarDatosUsuario = async (usuarioId, usuarioData) => {
    usuarios[usuarioId] = usuarioData;
};

let handler = async (m, { conn }) => {
    const usuarioId = m.sender;
    const dulcesGanados = 500;

    let usuarioData = await obtenerDatosUsuario(usuarioId);
    const hoy = new Date().toISOString().split('T')[0];

    if (usuarioData.ultimoReclamo === hoy) {
        return conn.sendMessage(m.chat, { text: "¡Ya has reclamado tus 500 dulces hoy! Espera hasta mañana para volver a reclamar." }, { quoted: m });
    }

    usuarioData.dulces += dulcesGanados;
    usuarioData.ultimoReclamo = hoy;

    await guardarDatosUsuario(usuarioId, usuarioData);

    const mensajeReclamo = `¡Has reclamado 500 dulces! 🎉🍬 Ahora tienes ${usuarioData.dulces} dulces en total.`;
    await conn.sendMessage(m.chat, { text: mensajeReclamo }, { quoted: m });
};

handler.help = ['claim3'];
handler.tags = ['juegos'];
handler.command = ['claim3'];

export default handler;