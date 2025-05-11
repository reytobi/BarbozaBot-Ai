
const handler = async (m, { conn}) => {
    const juegos = [
        "🟩 Pong Clásico",
        "🟦 Snake Legendario",
        "🟥 Tetris Extremo",
        "🔵 Pac-Man Escape"
    ];

    const juegoElegido = juegos[Math.floor(Math.random() * juegos.length)];
    let mensaje = `🕹️ *Arcade Classic!* 🎮🔥\n\n🎯 *Juego seleccionado:* ${juegoElegido}\n🆕 ¡Disfruta tu partida!`;

    await conn.sendMessage(m.chat, { text: mensaje});
};

handler.command = ["arcadeclassic"];
export default handler;
```

---

*🔥 Código `.rankedmode` – Competencia Gamer*
```javascript
const handler = async (m, { conn}) => {
    const niveles = [
        "🟢 Principiante",
        "🔵 Intermedio",
        "🟣 Avanzado",
        "🔥 Experto",
        "👑 Leyenda"
    ];

    const nivelElegido = niveles[Math.floor(Math.random() * niveles.length)];
    let mensaje = `🔥 *Modo Ranked!* 🏆🎮\n\n📈 *Tu nivel actual es:* ${nivelElegido}\n⚡ ¡Sigue jugando para subir de nivel!`;

    await conn.sendMessage(m.chat, { text: mensaje});
};

handler.command = ["rankedmode"];
export default handler;
```

---

*🏅 Código `.gamertournament` – Torneo de Jugadores*
```javascript
const handler = async (m, { conn}) => {
    const torneos = [
        "🏆 Copa Élite",
        "🎯 Desafío de Habilidad",
        "🎮 Batalla Gamer Extrema",
        "🚀 Liga de Velocidad",
        "👾 Torneo de Monstruos"
    ];

    const torneoElegido = torneos[Math.floor(Math.random() * torneos.length)];
    let mensaje = `🏅 *Torneo Gamer!* 🎮⚡\n\n📌 *Evento:* ${torneoElegido}\n🔥 ¡Prepárate para competir!`;

    await conn.sendMessage(m.chat, { text: mensaje});
};

handler.command = ["gamertournament"];
export default handler;
```

---

*🌍 Código `.gamermission` – Misiones Épicas*
```javascript
const handler = async (m, { conn}) => {
    const misiones = [
        "🛸 Explorar la galaxia perdida",
        "🎭 Resolver un misterio antiguo",
        "⚔️ Vencer al jefe supremo",
        "💎 Encontrar el tesoro oculto",
        "🧠 Superar un desafío mental"
    ];

    const misionElegida = misiones[Math.floor(Math.random() * misiones.length)];
    let mensaje = `🌍 *Misión Épica!* 🏹💡\n\n📌 *Tu desafío:* ${misionElegida}\n🎮 ¡Completa la misión para ganar puntos!`;

    await conn.sendMessage(m.chat, { text: mensaje});
};

handler.command = ["gamermission"];
export default handler;