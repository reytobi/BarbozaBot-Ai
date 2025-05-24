
import ws from 'ws';

async function handler(m, { conn: stars, usedPrefix}) {
  let botList = [];

  for (let conn of global.conns) {
    if (
      conn &&
      conn.user &&
      conn.ws &&
      conn.ws.socket &&
      conn.ws.socket.readyState!== ws.CLOSED
) {
      let connectedAt = conn.user.connectedAt || Date.now();
      let timeElapsed = Math.floor((Date.now() - connectedAt) / 1000);
      let hours = Math.floor(timeElapsed / 3600);
      let minutes = Math.floor((timeElapsed % 3600) / 60);
      let seconds = timeElapsed % 60;

      botList.push({
        jid: conn.user.jid,
        name: conn.user.name || '-',
        link: `https://wa.me/${conn.user.jid.replace(/[^0-9]/g, '')}`,
        timeConnected: `${hours}h ${minutes}m ${seconds}s`
});
}
}

  let message =
    botList.length> 0
? botList
.map(
            (bot, index) =>
              `*${index + 1}.* @${bot.jid.replace(/[^0-9]/g, '')}\n*Link:* ${bot.link}\n*Nombre:* ${bot.name}\n*Tiempo Conectado:* ${bot.timeConnected}`
)
.join('\n\n')
: 'No hay bots conectados.';

  let responseMessage = `*Total de Bots:* ${botList.length}\n\n${message}`;

  await stars.sendMessage(
    m.chat,
    { text: responseMessage, mentions: stars.parseMention(responseMessage)},
    { quoted: m}
);
}

handler.command = ['bots', 'activebots'];
handler.help = ['activebots'];
handler.tags = ['botlist'];
export default handler;