import axios from 'axios'
import yts from 'yt-search'

let HS = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, `❀ Ingresa el nombre de una canción`, m)

  try {
    let search = await yts(text)
    let vid = search.videos[0]

    if (!vid) return conn.reply(m.chat, `❀ No se encontraron resultados para "${text}"`, m)

    let apiUrl = 'http://mediahub.vercel/api/download/ytmp3?='  
    let encodedUrl = Buffer.from('aHR0cHM6Ly9tYWhpcnUtc2hpaW5hLnZlcmNlbC5hcHAvZG93bmxvYWQveXRtcDM/dXJsPQ==', 'base64').toString('utf-8')

    let api = await axios.get(`${encodedUrl}${vid.url}`)
    let json = api.data

    let { title, description, uploaded, duration, views, type, url, thumbnail, author, download } = json.data
    let { name, url: authorUrl } = author

    let HS = `╭━━〔 *Bot Barboza Ai* 〕━━⬣
┃ ✦ *Título:* ${title}
┃ ✦ *Autor:* ${name}
┃ ✦ *Descripción:* ${description}
┃ ✦ *Subido:* ${uploaded}
┃ ✦ *Duración:* ${duration}
┃ ✦ *Vistas:* ${views}
┃ ✦ *Fuente:* ${apiUrl}
╰━━━━━━━━━━━━━━⬣`

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: HS }, { quoted: m })
    await conn.sendMessage(m.chat, { audio: { url: download }, mimetype: 'audio/mpeg' }, { quoted: m })

  } catch (error) {
    console.error(error)
    conn.reply(m.chat, `❀ Hubo un error al procesar tu solicitud`, m)
  }
}

HS.command = ['play']

export default HS