
let handler = async (m, { conn, usedPrefix, command }) => {
    let players = []; // Lista para almacenar a los jugadores
    let maxPlayers = 8; // Número máximo de jugadores (4vs4)

    // Mensaje inicial para iniciar la partida
    let text = `🔥 *4vs4 Match* 🔥\n\nReacciona con ❤️ para unirte al juego.\n\nJugadores actuales: ${players.length}/${maxPlayers}\n\n*Esperando jugadores...*`;

    // Enviar mensaje inicial
    let sentMsg = await conn.sendMessage(m.chat, { text }, { quoted: m });

    // Crear función para manejar reacciones
    conn.on('reaction', async (reaction) => {
        if (reaction.key.id === sentMsg.key.id && reaction.reaction.emoji === '❤️') {
            let user = reaction.sender;
            if (!players.includes(user) && players.length < maxPlayers) {
                players.push(user); // Añadir al usuario a la lista de jugadores
                let updateText = `🔥 *4vs4 Match* 🔥\n\nReacciona con ❤️ para unirte al juego.\n\nJugadores actuales: ${players.length}/${maxPlayers}\n\n*Esperando jugadores...*\n\n📌 *Jugadores:*\n${players.map((p, i) => `${i + 1}. @${p.split('@')[0]}`).join('\n')}`;
                await conn.sendMessage(m.chat, { text: updateText, mentions: players }, { quoted: m });
            }
            if (players.length === maxPlayers) {
                // Equipos completos, comenzar partida
                let team1 = players.slice(0, 4);
                let team2 = players.slice(4, 8);
                let matchText = `🔥 *¡Equipos listos!* 🔥\n\n🟦 *Equipo 1:*\n${team1.map((p, i) => `${i + 1}. @${p.split('@')[0]}`).join('\n')}\n\n🟥 *Equipo 2:*\n${team2.map((p, i) => `${i + 1}. @${p.split('@')[0]}`).join('\n')}\n\n¡Buena suerte! 🏆`;
                await conn.sendMessage(m.chat, { text: matchText, mentions: players }, { quoted: m });
                players = []; // Reiniciar lista de jugadores para otra partida
            }
        }
    });
};

handler.help = ['4vs4'];
handler.tags = ['games'];
handler.command = ['4vs4'];
handler.group = true; // Solo funciona en grupos

export default handler;