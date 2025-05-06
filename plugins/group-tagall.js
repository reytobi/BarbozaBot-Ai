
const obtenerBandera = (codigoPais) => {
    const banderas = {
        'AR': '🇦🇷', 'BR': '🇧🇷', 'CA': '🇨🇦', 'EA': '🇪🇦', 'EC': '🇪🇨', 'ES': '🇪🇸',
        'DK': '🇩🇰', 'CR': '🇨🇷', 'CO': '🇨🇴', 'CU': '🇨🇺', 'CH': '🇨🇭', 'CK': '🇨🇰', 
        'CL': '🇨🇱', 'ET': '🇪🇹', 'FR': '🇫🇷', 'GB': '🇬🇧', 'GE': '🇬🇪', 'GR': '🇬🇷', 
        'GW': '🇬🇼', 'HN': '🇭🇳', 'HR': '🇭🇷', 'IC': '🇮🇨', 'ID': '🇮🇩', 'KR': '🇰🇷', 
        'LR': '🇱🇷', 'PE': '🇵🇪', 'PA': '🇵🇦', 'PR': '🇵🇷', 'PT': '🇵🇹', 'SA': '🇸🇦', 
        'VE': '🇻🇪', 'US': '🇺🇸', 'UY': '🇺🇾', 'XX': '🏴' // XX = sin país
    };

    return banderas[codigoPais] || '🌍';
};

const handler = async (m, { conn, participants }) => {
    if (!m.isGroup) return m.reply("❌ *Este comando solo funciona en grupos.*");

    if (!participants || participants.length === 0) return m.reply("⚠️ *No hay suficientes miembros en el grupo.*");

    let mensaje = "📢 *¡Atención grupo!* 📢\n👥 *Lista de miembros con banderas:*\n";

    for (const miembro of participants) {
        const codigoPais = miembro.id.split("@")[1].slice(0, 2).toUpperCase();
        const bandera = obtenerBandera(codigoPais);
        mensaje += `🔹 ${bandera} @${miembro.id.split("@")[0]}\n`;
    }

    mensaje += "🚀 *Mencionando a todos!*";

    await conn.sendMessage(m.chat, { text: mensaje, mentions: participants.map(p => p.id) });
};

handler.command = ['todos'];
export default handler;