
let handler = async (m, { conn, text }) => {
    // Verificar si se ha proporcionado un usuario
    if (!text) {
        return conn.sendMessage(m.chat, { text: "Por favor, menciona a un usuario. Ejemplo: .adoptada @usuario" }, { quoted: m });
    }

    let user = text.replace(/[^0-9]/g, ''); // Extraer el ID del usuario mencionado
    let adoptadaMessage = `_*@⁨${user}/⁩* *ES/IS* *%* *ADOPTADa*_ Sus padres se fueron x pañales 😞😂`;

    // Enviamos el mensaje al chat
    await conn.sendMessage(m.chat, { text: adoptadaMessage }, { quoted: m });
}

handler.help = ['adoptada @usuario'];
handler.tags = ['diversión'];
handler.command = ['adoptada'];

export default handler;