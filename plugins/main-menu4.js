
const handler = async (m, { conn}) => {
    let mensaje = `
🎮 *Menú de Juegos* 🎮

 .trivia
 .ahorcado
 .game
 .ruleta
 .pelear
 .sopa
 .cazar
 .acertijo
 .dado
 .mate
 .emoji
 




📌 *Usa el comando de cada juego para jugar!*
`;
    const imageUrl = "https://qu.ax/Mvhfa.jpg";

    await conn.sendMessage(m.chat, {
        image: { url: imageUrl},
        caption: mensaje
});
};

handler.command = ["menu4"];
export default handler;