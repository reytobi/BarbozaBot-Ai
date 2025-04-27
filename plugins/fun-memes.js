import fetch from 'node-fetch'

export const handler = async (m, { conn, usedPrefix, command }) => {
  await conn.sendMessage(m.chat, { react: { text: '🔵', key: m.key } })

  try {
    const res = await fetch('https://api.vreden.my.id/api/meme')

    if (!res.ok) throw 'Error al consultar el meme.'

    const json = await res.json()

    if (!json.result) throw 'No se encontró un meme.'

    await conn.sendMessage(m.chat, { image: { url: json.result }, caption: '😂 Aquí tienes tu meme' }, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: '🟢', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '🔴', key: m.key } })
    conn.reply(m.chat, '🔴 Ocurrió un error al buscar el meme.', m)
  }
}

handler.help = ['meme']
handler.tags = ['fun']
handler.command = /^meme$/i

export default handler