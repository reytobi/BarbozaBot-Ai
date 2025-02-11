import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, text, args }) => {
  if (!text) return conn.reply(m.chat, `❀ Ingresa el nombre de lo que quieres buscar`, m)

  // Reacción de reloj 📀 mientras busca
  await conn.sendMessage(m.chat, { react: { text: "📀", key: m.key } });

  try {
    let res = await search(args.join(" "));

    let apiAud = await fetch(`https://api.agungny.my.id/api/youtube-audio?url=${'https://youtu.be/' + res[0].videoId}`)
    let dataAud = await apiAud.json()
    let apiVid = await fetch(`https://api.agungny.my.id/api/youtube-video?url=${'https://youtu.be/' + res[0].videoId}`)
    let dataVid = await apiVid.json()

    let txt = `*◆ [ YOUTUBE - PLAY ] ◆*
- *Titulo:* ${res[0].title}
- *Duracion:* ${res[0].timestamp}
- *Visitas:* ${res[0].views}
- *Subido:* ${res[0].ago}

◆────────────────◆

Responde a este mensaje dependiendo lo que quieras :

1 : Audio
2 : Video`

    let SM = await conn.sendFile(m.chat, res[0].thumbnail, 'HasumiBotFreeCodes.jpg', txt, m)

    // Reacción de éxito ✅
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    conn.ev.on("messages.upsert", async (upsertedMessage) => {
      let RM = upsertedMessage.messages[0];
      if (!RM.message) return

      const UR = RM.message.conversation || RM.message.extendedTextMessage?.text
      let UC = RM.key.remoteJid

      if (RM.message.extendedTextMessage?.contextInfo?.stanzaId === SM.key.id) {
        if (UR === '1') {
          await conn.sendMessage(UC, { audio: { url: dataAud.result.downloadUrl }, mimetype: "audio/mpeg" }, { quoted: RM })
        } else if (UR === '2') {
          await conn.sendMessage(m.chat, { video: { url: dataVid.result.downloadUrl }, caption: "", mimetype: 'video/mp4', fileName: `${res[0].title}.mp4` }, { quoted: m })
        } else {
          await conn.sendMessage(UC, { text: "Opcion invalida, responde con 1 *(audio)* o 2 *(video)*." }, { quoted: RM })
        }
      }
    })
  } catch (error) {
    console.error(error)

    // Reacción de error ❌
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });

    conn.reply(m.chat, `Hubo un error al procesar la búsqueda. Intenta nuevamente.`, m)
  }
}

handler.command = ["play"]

export default handler

async function search(query, options = {}) {
  let search = await yts.search({ query, hl: "es", gl: "ES", ...options })
  return search.videos
}