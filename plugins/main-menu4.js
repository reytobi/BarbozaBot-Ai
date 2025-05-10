
const handler = async (m, { conn}) => {
    let mensaje = `
🌟 *¡Bienvenido al Menú de Juegos!* 🌟
🎮 *Prepárate para horas de diversión y desafíos emocionantes!* 🎮

━━━━━━━━━━━━━━━━━━
🏆 *Categorías de Juegos:*
━━━━━━━━━━━━━━━━━━

✨ *Juegos de Habilidad 🧠*
🔹.trivia ➜ *Responde preguntas de conocimiento y demuestra tu inteligencia.*
🔹.ahorcado ➜ *Adivina la palabra oculta antes de quedarte sin intentos.*
🔹.acertijo ➜ *Resuelve enigmas que desafiarán tu lógica y pensamiento rápido.*
🔹.mate ➜ *Prueba tu velocidad con operaciones matemáticas contra reloj.*

🔥 *Juegos de Azar 🎲*
🔹.ruleta ➜ *Gira la ruleta y prueba tu suerte con premios y sorpresas.*
🔹.dado ➜ *Lanza el dado y gana puntos en una emocionante apuesta.*
🔹.pelear ➜ *Desafía a otros jugadores en un duelo de habilidad y estrategia.*

🌍 *Juegos de Aventura 🚀*
🔹.cazar ➜ *Explora la naturaleza y busca presas para conseguir recompensas.*
🔹.supervivencia ➜ *Toma decisiones cruciales para seguir con vida en situaciones extremas.*
🔹.detective ➜ *Investiga pistas y resuelve misterios en cada partida.*

🚀 *Juegos de Velocidad 🏎️*
🔹.carrera ➜ *Corre contra otros jugadores y alcanza la meta en primer lugar.*
🔹.animal ➜ *Apuesta en emocionantes carreras con animales veloces.*

⚔️ *Juegos Temáticos 🏛️*
🔹.zombie ➜ *Sobrevive al apocalipsis zombie y lucha contra hordas de infectados.*
🔹.gladiador ➜ *Lucha en la arena y conviértete en el guerrero más fuerte.*
🔹.asalto ➜ *Planea un robo perfecto sin ser atrapado por las fuerzas de seguridad.*
🔹.robot ➜ *Entrena a tu robot para ganar combates de alta tecnología.*
🔹.magia ➜ *Lanza hechizos y vence en duelos mágicos épicos.*

🍽️ *Modo Especial: Juegos de Cocina 🍳*
🔹.chefextremo ➜ *Cocina bajo presión y supera desafíos culinarios difíciles.*
🔹.chefloco ➜ *Enfréntate a caos en la cocina con ingredientes locos y situaciones absurdas.*
🔹.batallachef ➜ *Compite contra otros chefs y crea el platillo más delicioso.*
🔹.postres ➜ *Sorprende a los jueces con un postre espectacular y gana la competencia.*

━━━━━━━━━━━━━━━━━━
🔥 *Compite con amigos y escala en el ranking de los mejores jugadores!*
🕹️ *Escribe el comando de cualquier juego para comenzar la partida!*
🚀 *¿Estás listo para la diversión?*
`;

    const imageUrl = "https://qu.ax/Mvhfa.jpg";

    await conn.sendMessage(m.chat, {
        image: { url: imageUrl},
        caption: mensaje
});
};

handler.command = ["menu4"];
export default handler;