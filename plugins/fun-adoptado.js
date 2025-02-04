
let handler = async (m, { conn, text }) => {
    // Verificar si se ha proporcionado un usuario
    if (!text) {
        return conn.sendMessage(m.chat, { text: "Por favor, menciona a un usuario. Ejemplo: .adoptado @usuario" }, { quoted: m });
    }

    let user = text.replace(/[^0-9]/g, ''); // Extraer el ID del usuario mencionado
    let adoptedMessage = `_*@⁨${user}/⁩* *ES/IS* *%* *ADOPTADO*_ Sus padres se fueron x pañales 😞😂`;

    // Enviamos el mensaje al chat
    await conn.sendMessage(m.chat, { text: adoptedMessage }, { quoted: m });
}

handler.help = ['adoptado @usuario'];
handler.tags = ['diversión'];
handler.command = ['adoptado'];

export default handler;