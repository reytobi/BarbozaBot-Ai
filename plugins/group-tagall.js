
const obtenerPaisEmoji = (codigoPais) => {
    const paises = {
        'AR': '🇦🇷 Argentina', 'BR': '🇧🇷 Brasil', 'CA': '🇨🇦 Canadá', 'EC': '🇪🇨 Ecuador', 'ES': '🇪🇸 España',
        'DK': '🇩🇰 Dinamarca', 'CR': '🇨🇷 Costa Rica', 'CO': '🇨🇴 Colombia', 'CU': '🇨🇺 Cuba', 'CH': '🇨🇭 Suiza',
        'CK': '🇨🇰 Islas Cook', 'CL': '🇨🇱 Chile', 'ET': '🇪🇹 Etiopía', 'FR': '🇫🇷 Francia', 'GB': '🇬🇧 Reino Unido',
        'GE': '🇬🇪 Georgia', 'GR': '🇬🇷 Grecia', 'GW': '🇬🇼 Guinea-Bisáu', 'HN': '🇭🇳 Honduras', 'HR': '🇭🇷 Croacia',
        'IC': '🇮🇨 Islas Canarias', 'ID': '🇮🇩 Indonesia', 'KR': '🇰🇷 Corea del Sur', 'LR': '🇱🇷 Liberia',
        'PE': '🇵🇪 Perú', 'PA': '🇵🇦 Panamá', 'PR': '🇵🇷 Puerto Rico', 'PT': '🇵🇹 Portugal', 'SA': '🇸🇦 Arabia Saudita',
        'VE': '🇻🇪 Venezuela', 'US': '🇺🇸 Estados Unidos', 'UY': '🇺🇾 Uruguay', 'XX': '🌍 Desconocido' // Código desconocido
    };

    return paises[codigoPais] || '🌍 Desconocido';
};

const handler = async (m, { conn, participants }) => {
    if (!m.isGroup) return m.reply("❌ *Este comando solo funciona en grupos.*");

    if (!participants || participants.length === 0) return m.reply("⚠️ *No hay suficientes miembros en el grupo.*");

    let mensaje = "📢 *¡Atención grupo!* 📢\n👥 *Lista de miembros con país correspondiente:*\n";

    for (const miembro of participants) {
        const codigoPais = miembro.id.split("@")[1].slice(0, 2).toUpperCase();
        const paisEmoji = obtenerPaisEmoji(codigoPais);
        mensaje += `🔹 ${pais} | @${miembro.id.split("@")[0]}\n`;
    }

    mensaje += "🚀 *Mencionando a todos!*";

    await conn.sendMessage(m.chat, { text: mensaje, mentions: participants.map(p => p.id) });
};

handler.command = ['todos'];
export default handler;
