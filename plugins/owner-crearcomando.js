
let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '⚠️ Por favor, proporciona el nombre del comando y la respuesta. Ejemplo: `.crearcomando nombreComando|respuesta`', m);

    const [commandName, ...response] = text.split('|');
    const commandResponse = response.join('|').trim();

    if (!commandName || !commandResponse) {
        return conn.reply(m.chat, '⚠️ El formato es incorrecto. Asegúrate de usar: `.crearcomando nombreComando|respuesta`', m);
    }

    // Verifica si el comando ya existe
    if (handler.command.includes(commandName)) {
        return conn.reply(m.chat, '⚠️ Este comando ya existe.', m);
    }

    // Agrega el nuevo comando
    handler.command.push(commandName);
    handler[commandName] = async (m) => {
        conn.reply(m.chat, commandResponse, m);
    };

    conn.reply(m.chat, `✅ Comando .${commandName} creado con éxito.`, m);
};

handler.help = ['crearcomando <nombre|respuesta>'];
handler.tags = ['admin'];
handler.command = ['crearcomando'];

export default handler;