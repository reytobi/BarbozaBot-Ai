
const handler = async (m, { conn}) => {
    let mensaje = `
*🌟 ¡Bienvenido al Menú de Juegos! 🌟*
🎮 Desafíos, acción y diversión asegurada!

━━━━━━━━━━━━━━━━━━
🏆 *Categorías de Juegos* 🏆
━━━━━━━━━━━━━━━━━━

✨ *Juegos de Habilidad 🧠*
🧐.trivia ➜ 📝 Pon a prueba tu conocimiento con preguntas desafiantes!
📜.ahorcado ➜ 🔡 Adivina la palabra antes de perder!
🔑.acertijo ➜ 🧩 Resuelve enigmas y demuestra tu lógica!
➗.mate ➜ 🧮 Compite en cálculos matemáticos rápidos!
🧩.sopa ➜ 🔠 Encuentra palabras ocultas y completa la sopa de letras!

🔥 *Juegos de Azar 🎲*
🎰.ruleta ➜ 🔄 Gira la ruleta y prueba tu suerte!
🎲.dado ➜ 🎲 Lanza el dado y gana premios aleatorios!
🥊.pelear ➜ 💥 Enfrenta a otros jugadores en un duelo épico!

🌍 *Juegos de Aventura 🚀*
🏹.cazar ➜ 🦌 Explora, busca presas y consigue recompensas!
🌲.supervivencia ➜ 🏕️ Toma decisiones para sobrevivir en escenarios extremos!
🕵️.detective ➜ 🔍 Investiga casos misteriosos y encuentra pistas!
🚪.escape ➜ 🔑 Resuelve acertijos y escapa de habitaciones cerradas!

🚀 *Zona de Velocidad 🏎️*
🏁.speed ➜ 🚥 Compite en modos de velocidad extrema y prueba tus reflejos!

⚔️ *Juegos Temáticos 🏛️*
🧟‍♂️.zombie ➜ 🧠 Sobrevive al apocalipsis y lucha contra hordas de infectados!
⚔️.gladiador ➜ 🏛️ Demuestra tu fuerza en la arena y conviértete en campeón!
💰.asalto ➜ 🕶️ Planea el robo perfecto sin ser descubierto!
🔮.magia ➜ ✨ Domina hechizos y vence en épicos duelos mágicos!

👽 *Modo Alienígena 🚀*
🛸.alienigena ➜ 🌍 Defiende la Tierra de una invasión extraterrestre!
🕵️‍♂️.aliens ➜ 👀 Descubre infiltrados alienígenas en tu equipo!
🌌.multiverso ➜ 🔄 Viaja entre dimensiones y lucha en el multiverso!

🤖 *Modo Futurista*
🔩.robotp ➜ 🤖 Construye tu propio robot y compite en combates tecnológicos!

🎭 *Modo Emoji*
😃.emoji ➜ 🎭 Responde con el emoji correcto antes de que acabe el tiempo!

🎮 *Modo Game*
🕹️.game ➜ 🎮 Desafíos de videojuegos clásicos y partidas rápidas!

🍽️ *Modo Especial: Juegos de Cocina 🍳*
🍕.chefextremo ➜ 🔥 Cocina bajo presión y supera desafíos culinarios!
🎭.chefloco ➜ 🌀 Enfréntate a caos en la cocina con ingredientes locos!
🥇.batallachef ➜ 👨‍🍳 Compite contra otros chefs y demuestra tu talento!
🍰.postres ➜ 🎂 Sorprende a los jueces con un postre espectacular!

━━━━━━━━━━━━━━━━━━
🔥 Juega, compite y diviértete con tu bot! 🏆
🕹️ Escribe el comando de cualquier juego para comenzar!
🚀 ¡La diversión no tiene límites!*
`;

    const imageUrl = "https://qu.ax/Mvhfa.jpg";

    await conn.sendMessage(m.chat, {
        image: { url: imageUrl},
        caption: mensaje
});
};

handler.command = ["menu4"];
handler.tags = ['main'];
export default handler;