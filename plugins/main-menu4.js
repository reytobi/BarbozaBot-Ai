
const handler = async (m, { conn}) => {
    let mensaje = `
🎮 *Menú de Juegos* 🎮

1️⃣ .trivia
2️⃣ .ahorcado
3️⃣ .game
4️⃣ .ruleta
5️⃣ .pelear
6️⃣ .sopa
7️⃣ .buscarpalabras
8️⃣ .acertijo



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