
import yts from 'yt-search';

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
  if (!text) return conn.reply(m.chat, `ESCRIBA EL NOMBRE DE UN VIDEO O CANAL DE YOUTUBE`, fkontak, m);
  try {
    let result = await yts(text);
    let ytres = result.videos;
    let teskd = `Busqueda de *${text}*`;

    let listSections = [];
    for (let index in ytres) {
      let v = ytres[index];
      listSections.push({
        title: `RESULTADOS`,
        rows: [
          {
            header: 'AUDIO',
            title: "",
            description: `${v.title} | ${v.timestamp}\n`, 
            id: `${usedPrefix}ytmp3 ${v.url}`
          },
          {
            header: "VIDEO",
            title: "" ,
            description: `${v.title} | ${v.timestamp}\n`, 
            id: `${usedPrefix}ytmp4 ${v.url}`
          },
          {
            header: "AUDIO DOC",
            title: "" ,
            description: `${v.title} | ${v.timestamp}\n`, 
            id: `${usedPrefix}ytmp3doc ${v.url}`
          },
          {
            header: "VIDEO DOC",
            title: "" ,
            description: `${v.title} | ${v.timestamp}\n`, 
            id: `${usedPrefix}ytmp4doc ${v.url}`
          }
        ]
      });
    }

    await conn.sendList(m.chat, `RESULTADOS\n`, `Busqueda de: ${text}`, `BUSCAR`, listSections, fkontak);
  } catch (e) {
    await conn.sendButton(m.chat, `\n${wm}`, `Hubo un error, por favor intente más tarde`, null, [[`Reporte`, `#reporte ${usedPrefix + command}`]], null, null, m);
    console.log(e);
  }
}

handler.help = ['playlist'];
handler.tags = ['dl'];
handler.command = /^playlist|ytbuscar|yts(earch)?$/i;
handler.limit = 1;
handler.level = 3;

export default handler;