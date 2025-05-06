
import fetch from "node-fetch";

const obtenerBandera = async (codigoPais) => {
    try {
        return codigoPais ? `https://flagcdn.com/w40/${codigoPais.toLowerCase()}.png` : "🌍";
    } catch (error) {
        console.error("❌ Error obteniendo bandera:", error);
        return "🌍";
    }
};

const handler = async (m, { conn, participants }) => {
    if (!m.isGroup) return m.reply("❌ *Este comando solo funciona en grupos.*");

    if (!participants || participants.length === 0) return m.reply("⚠️ *No hay suficientes miembros en el grupo.*");

    let mensaje = "📢 *¡Atención grupo!* 📢\n👥 *Lista de miembros con banderas:*\n";

    for (const miembro of participants) {
        const codigoPais = miembro.id.split("@")[1].slice(0, 2); // Obtener código de país
        const bandera = await obtenerBandera(codigoPais);
        mensaje += `🔹 ${bandera} @${miembro.id.split("@")[0]}\n`;
    }

    mensaje += "🚀 *Mencionando a todos!*";

    await conn.sendMessage(m.chat, { text: mensaje, mentions: participants.map(p => p.id) });
};

handler.command = ['todos'];
export default handler;