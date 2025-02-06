/* 

*❀ By JTxs*

[ Canal Principal ] :
https://whatsapp.com/channel/0029VaeQcFXEFeXtNMHk0D0n

[ Canal Rikka Takanashi Bot ] :
https://whatsapp.com/channel/0029VaksDf4I1rcsIO6Rip2X

[ Canal StarlightsTeam] :
https://whatsapp.com/channel/0029VaBfsIwGk1FyaqFcK91S

[ HasumiBot FreeCodes ] :
https://whatsapp.com/channel/0029Vanjyqb2f3ERifCpGT0W
*/

// *[ ❀ PLAY ]*
import fetch from 'node-fetch'

let handler = async (m, { conn, command, text, usedPrefix }) => {
if (!text) return conn.reply(m.chat, `❀ Ingresa el nombre de la cancion que quieras buscar`, m)

try {
let api = await fetch(`https://api.vreden.web.id/api/ytplaymp3?query=${text}`)
let json = await api.json()
let { title, thumbnail, timestamp, ago, views, author } = json.result.metadata
let HS = `- *Titulo :* ${title}
- *Duracion :* ${timestamp}
- *Subido :* ${ago}
- *Visitas :* ${views}
- *Autor :* ${author.name}`
await conn.sendFile(m.chat, thumbnail, 'HasumiBotFreeCodes.jpg', HS, m)
await conn.sendFile(m.chat, json.result.download.url, 'HasumiBotFreeCodes.mp3', null, m)
} catch (error) {
console.error(error)
}}

handler.command = /^(play)$/i

export default handler