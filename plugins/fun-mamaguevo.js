
let handler = async (m, { conn, args }) => {
    const usuarioId = m.sender; // ID del usuario que envió el mensaje
    const porcentajeBase = 20; // Porcentaje fijo para el cálculo

    // Verificar que se haya proporcionado un número
    if (!args[0] || isNaN(args[0])) {
        return conn.sendMessage(m.chat, { text: "⚠️ Por favor, proporciona un número para calcular el porcentaje. Ejemplo: .mamaguevo <número>" }, { quoted: m });
    }

    const numero = parseFloat(args[0]); // Convertir el argumento a número
    const resultado = (numero * porcentajeBase) / 100; // Calcular el porcentaje

    // Mensaje de respuesta con mención al usuario
    const mensajeRespuesta = `@${usuarioId.split('@')[0]}, el ${porcentajeBase}% de ${numero} es ${resultado}. 🎉`;
    
    await conn.sendMessage(m.chat, { text: mensajeRespuesta, mentions: [usuarioId] }, { quoted: m });
}

handler.help = ['mamaguevo <número>'];
handler.tags = ['calculadora'];
handler.command = ['mamaguevo'];

export default handler;