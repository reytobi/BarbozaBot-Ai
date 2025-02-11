
let poesías = [
    `
🌟✨ *Poesía para ti* ✨🌟

En el jardín de la vida, florece el amor,  
cada pétalo es un susurro, un dulce clamor.  
Las estrellas brillan en la noche serena,  
y en cada latido, tú eres la vena.
    `,
    `
🌈 *Verso de esperanza* 🌈

Cuando la tormenta oscurece el cielo,  
recuerda que siempre hay un destello.  
Las nubes se van y vuelve el sol,  
brillando en tu vida con todo su rol.
    `,
    `
🍃 *Susurros del viento* 🍃

El viento sopla suave entre los árboles,  
susurra secretos que nunca son inalcanzables.  
Cada hoja que cae tiene su razón,  
y en cada cambio, hay una canción.
    `
];

let handler = async (m) => {
    let userId = m.sender; // ID del usuario
    if (!global.usedPoesias) global.usedPoesias = {}; // Inicializar si no existe
    if (!global.usedPoesias[userId]) global.usedPoesias[userId] = 0; // Contador de poesías por usuario

    let index = global.usedPoesias[userId];
    
    // Enviar la poesía correspondiente
    if (index < poesías.length) {
        await conn.sendMessage(m.chat, { text: poesías[index] }, { quoted: m });
        global.usedPoesias[userId] += 1; // Aumentar el contador
    } else {
        await conn.sendMessage(m.chat, { text: "Ya has recibido todas las poesías disponibles. ¡Intenta más tarde!" }, { quoted: m });
    }
}

handler.help = ['poesía'];
handler.tags = ['arte'];
handler.command = ['poesía'];

export default handler;