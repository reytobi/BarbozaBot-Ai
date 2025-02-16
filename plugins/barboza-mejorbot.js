let handler = async (m, { conn, args, usedPrefix, command }) => {
let str = `Hola🤨🚩`.trim()
conn.sendMessage(m.chat, { video: { url: './media/edar.mp4' }, gifPlayback: true, caption: str.trim(), mentions: [m.sender] }, { quoted: m })
}
handler.command = /^(Barboza)$/i;
export default handler;