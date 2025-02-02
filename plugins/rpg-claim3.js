
let handler = async (m, { conn }) => {
    const usuarioId = m.sender; // ID del usuario
    const dulcesGanados = 500; // Cantidad de dulces a ganar

    // Obtener los datos del usuario (deberías tener una función para esto)
    let usuarioData = await obtenerDatosUsuario(usuarioId); // Función ficticia para obtener datos del usuario

    const hoy = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

    // Verificar si ya reclamó hoy
    if (usuarioData.ultimoReclamo === hoy) {
        return conn.sendMessage(m.chat, { text: "¡Ya has reclamado tus 500 dulces hoy! Espera hasta mañana para volver a reclamar." }, { quoted: m });
    }

    // Actualizamos la cantidad de dulces y la fecha del último reclamo
    usuarioData.dulces += dulcesGanados; // Sumar los dulces ganados
    usuarioData.ultimoReclamo = hoy; // Actualizar la fecha del último reclamo

    await guardarDatosUsuario(usuarioId, usuarioData); // Función ficticia para guardar datos del usuario

    const mensajeReclamo = `¡Has reclamado 500 dulces! 🎉🍬 Ahora tienes ${usuarioData.dulces} dulces en total.`;
    
    await conn.sendMessage(m.chat, { text: mensajeReclamo }, { quoted: m });
}
handler.help = ['claim3'];
handler.tags = ['juegos'];
handler.command = ['claim3'];

export default handler;