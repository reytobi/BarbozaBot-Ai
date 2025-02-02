
let handler = async (m, { conn }) => {
    // Suponemos que tienes una función para obtener los datos de mascotas de los amigos
    const amigosData = await obtenerDatosMascotasDeAmigos(); // Función ficticia que debes implementar

    // Asegúrate de que amigosData sea un arreglo con objetos { nombre: "amigo", mascota: "mascota", puntos: puntos }
    const ranking = amigosData.map(amigo => ({
        nombre: amigo.nombre,
        mascota: amigo.mascota,
        puntos: amigo.puntos
    }));

    // Ordenar el ranking por puntos en orden descendente
    ranking.sort((a, b) => b.puntos - a.puntos);

    // Construir el mensaje del ranking
    let mensajeRanking = "🏆 Ranking de Mascotas de Amigos 🏆\n\n";
    
    ranking.forEach((item, index) => {
        mensajeRanking += `${index + 1}. ${item.nombre} - ${item.mascota} - ${item.puntos} puntos\n`;
    });

    if (ranking.length === 0) {
        mensajeRanking = "No hay datos disponibles para mostrar el ranking.";
    }

    await conn.sendMessage(m.chat, { text: mensajeRanking }, { quoted: m });
}

handler.help = ['topmascota'];
handler.tags = ['juegos'];
handler.command = ['topmascota'];

export default handler;