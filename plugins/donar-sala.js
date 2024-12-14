let toM = a => '@' + a.split('@')[0]
function handler(m, { groupMetadata }) {
let ps = groupMetadata.participants.map(v => v.id)
let a = ps.getRandom()
let b
do b = ps.getRandom()
while (b === a)
m.reply(`*${toM(a)},* _Busca la salita bebe que ya viene el vs_ 📌
𝗡𝗜𝗞𝗢𝗟𝗦𝗜𝗧𝗔 𝗕𝗢𝗧  ᡣ𐭩`, null, {
mentions: [a, b]
})}
handler.help = ['donarsala']
handler.tags = ['freefire']
handler.command = ['donarsala', 'sala']
handler.group = true 
export default handler