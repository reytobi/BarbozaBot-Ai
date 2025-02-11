
let handler = async (m) => {
    const poesía = `
🌟✨ *Poesía para ti* ✨🌟

En el jardín de la vida, florece el amor,  
cada pétalo es un susurro, un dulce clamor.  
Las estrellas brillan en la noche serena,  
y en cada latido, tú eres la vena.

Las olas del mar cantan su canción,  
mientras el viento acaricia con devoción.  
Eres un verso escrito en el cielo,  
una melodía que despierta anhelo.

Así que sigue soñando, nunca dejes de amar,  
la poesía está en ti, siempre lista para brillar.  
Con cada palabra que sale de tu ser,  
creas un mundo donde todo puede renacer.  
`;

    // Enviamos la poesía al chat
    await conn.sendMessage(m.chat, { text: poesía }, { quoted: m });
}

handler.help = ['poesía'];
handler.tags = ['arte'];
handler.command = ['poesía'];

export default handler;