
const handler = async (m, { conn, text}) => {
    try {
        // Verificar que el usuario haya ingresado un nuevo nombre
        if (!text) return m.reply('❌ *Error:* Debes escribir el nuevo nombre después de `.newname`.');

        // Cambiar el nombre del bot principal
        await conn.updateProfileName(text);

        // Cambiar el nombre de los subbots si existen
        if (conn.authState.creds.me.id) {
            await conn.updateProfileName(text);
}

        // Confirmar el cambio con emojis
        m.reply(`✅ *¡Nombre cambiado exitosamente!* 😃✨\n📌 *Nuevo nombre:* ${text}`);

} catch (error) {
        console.error(error);
        m.reply(`⚠️ *Error:* No se pudo cambiar el nombre. 🛑\n${error.message}`);
}
};

handler.command = /^newname$/i;
export default handler;