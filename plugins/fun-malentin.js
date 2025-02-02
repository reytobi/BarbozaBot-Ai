
const handler = async (m) => {
    if (m.text.startsWith('.maletín')) {
        // Detalles de la sorpresa
        const monedas = 20;
        const dulces = 10;
        const xp = 100;

        // Mensaje a enviar
        const mensaje = `🎒 *Maletín Abierto*\n\n¡Sorpresa! Has recibido:\n💰 ${monedas} Monedas\n🍬 ${dulces} Dulces\n✨ ${xp} XP\n\n➤ ¡Disfruta tu recompensa!`;

        return m.reply(mensaje);
    }
};

handler.command = /^(maletin|maleta)$/i;
export default handler;
