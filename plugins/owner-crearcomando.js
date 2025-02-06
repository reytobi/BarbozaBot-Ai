
let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '⚠️ Por favor, proporciona el nombre del comando y la respuesta. Ejemplo: `.crearcomando nombreComando|respuesta`', m);

    const [commandName, ...response] = text.split('|');
    const commandResponse = response.join('|').trim();

    if (!commandName || !commandResponse) {
        return conn.reply(m.chat, '⚠️ El formato es incorrecto. Asegúrate de usar: `.crearcomando nombreComando|respuesta`', m);
    }

    // Crea el código del nuevo comando
    const newCommandCode = `
let handler = async (m) => {
    conn.reply(m.chat, '${commandResponse}', m);
};

handler.help = ['${commandName}'];
handler.tags = ['custom'];
handler.command = ['${commandName}'];

export default handler;`;

    // Envía el código generado al usuario
    conn.reply(m.chat, `✅ Aquí tienes el código para tu nuevo comando:\n\`\`\`${newCommandCode}\`\`\``, m);
};

handler.help = ['crearcomando <nombre|respuesta>'];
handler.tags = ['admin'];
handler.command = ['crearcomando'];

export default handler;