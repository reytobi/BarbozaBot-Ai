const registerHandler = async (m, { conn, usedPrefix }) => {
    // Botón de Menú
    const buttons = [
        {
            buttonId: `${usedPrefix}menu`,
            buttonText: { displayText: "📜 Menú" },
            type: 1
        }
    ];

    await conn.sendMessage(
        m.chat,
        {
            text: "🎉 ¡Te has registrado!\n\nPresiona el botón para ver el menú.",
            buttons: buttons,
            viewOnce: true
        },
        { quoted: m }
    );
};

// Asignar comando "register"
registerHandler.command = /^register$/i;

export default registerHandler;