
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
        usuarios[usuarioId] = { dulces: 0, experiencia: 0, mascUsado: false };
        guardarDatos(usuarios);
    }
    return usuarios[usuarioId];
};

let handler = async (m, { conn }) => {
    const usuarioId = m.sender;
    let usuarioData = await obtenerDatosUsuario(usuarioId);

    // Verificamos si el comando ya fue usado
    if (usuarioData.mascUsado) {
        return await conn.sendMessage(m.chat, { text: "Ya has utilizado el comando .masc. ¡No puedes usarlo de nuevo!" }, { quoted: m });
    }

    // Asignamos los dulces y experiencia
    usuarioData.dulces += 5000;
    usuarioData.experiencia += 5000;
    
    // Marcamos que el comando ha sido usado
    usuarioData.mascUsado = true;

    // Guardamos los datos actualizados
    await guardarDatos(usuarioId, usuarioData);

    // Mensaje final
    let mensajeFinal = `¡Felicidades! Has ganado 5000 dulces y 5000 puntos de experiencia. 🎉\nAhora tienes ${usuarioData.dulces} dulces en total y ${usuarioData.experiencia} puntos de experiencia.`;

    // Enviamos el mensaje al chat
    await conn.sendMessage(m.chat, { text: mensajeFinal }, { quoted: m });
}

handler.help = ['masc'];
handler.tags = ['recompensas'];
handler.command = ['masc'];

export default handler;