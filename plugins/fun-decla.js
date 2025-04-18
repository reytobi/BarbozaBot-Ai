
let handler = async (m, { conn, args, command }) => {
    if (!args[0] || !args[1]) {
        return m.reply(`❗️ Usa el comando de esta manera:\n\n.declararse <número>|<mensaje>\n\nEjemplo:\n.declararse 1234567890|Hola, soy tu admirador secreto 🤍`);
    }

    const [numero, mensaje] = args.join(" ").split("|");

    if (!numero || !mensaje) {
        return m.reply(`❗️ Asegúrate de incluir el número y el mensaje separados por "|".`);
    }

    try {
        // Formatear número de teléfono
        const numeroFormateado = numero.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

        // Enviar el mensaje al número proporcionado
        await conn.sendMessage(numeroFormateado, { text: mensaje }, { quoted: m });

        // Confirmar envío en el chat
        return m.reply(`✅ Mensaje enviado a ${numero} de manera anónima:\n📝 *${mensaje}*`);
    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        return m.reply("❌ Ocurrió un error al intentar enviar el mensaje. Verifica el número e inténtalo nuevamente.");
    }
};

handler.command = ['declar'];
handler.help = ['decla <número>|<mensaje>'];
handler.tags = ['fun', 'tools'];

export default handler;