
const handler = async (m, { conn}) => {
    // Generar un número aleatorio del 1 al 6
    const resultado = Math.floor(Math.random() * 6) + 1;

    let mensaje = `🎲 *Has lanzado el dado y salió:* ${resultado}\n`;

    if (resultado === 1) mensaje += "😢 ¡Mala suerte!";
    else if (resultado === 6) mensaje += "🎉 ¡Número máximo, felicidades!";
    else mensaje += "🔄 Inténtalo de nuevo y consigue un mejor número.";

    await conn.sendMessage(m.chat, { text: mensaje});
};

handler.command = ["dados"];
export default handler;