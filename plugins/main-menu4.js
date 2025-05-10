
const handler = async (m, { conn}) => {
    let mensaje = `
🎮 *Menú de Juegos - Diviértete con tu bot!* 🎮

✨ *Juegos de habilidad:*
🧠.trivia - Prueba tu conocimiento
🔤.ahorcado - Adivina la palabra antes de perder
🎭.acertijo - Desafíos mentales para los más astutos
🎯.mate - Operaciones matemáticas rápidas

🔥 *Juegos de azar:*
🎰.ruleta - Gira y prueba tu suerte
🎲.dado - Lanza el dado y gana puntos
🥊.pelear - Un duelo entre jugadores

🌿 *Juegos de aventura:*
🏹.cazar - Busca presas y consigue recompensas
🌍.supervivencia - Toma decisiones para sobrevivir
🔍.detective - Investiga casos misteriosos

🚀 *Juegos de velocidad:*
🏎️.carrera - Corre con tu vehículo favorito
🐉.animal - Apuesta por un animal en la carrera

🧟 *Juegos temáticos:*
🧟‍♂️.zombie - Sobrevive al apocalipsis zombie
⚔️.gladiador - Lucha en la arena y conviértete en campeón
💰.asalto - Planea un robo sin ser atrapado
🤖.robot - Pelea con tu robot y vence en combate
🔮.magia - Usa hechizos y gana el duelo mágico

📌 *Usa el comando de cada juego para jugar y ganar puntos!*
🔹 **Compite con amigos y escala en el ranking de los mejores jugadores!** 🏆🔥

`;

    const imageUrl = "https://qu.ax/Mvhfa.jpg";

    await conn.sendMessage(m.chat, {
        image: { url: imageUrl},
        caption: mensaje
});
};

handler.command = ["menu4"];
export default handler;