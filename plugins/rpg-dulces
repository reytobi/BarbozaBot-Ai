import fs from 'fs'

const filePath = './mineria.json'

let handler = async (m, {conn, usedPrefix}) => {
   let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
   if (who == conn.user.jid) return conn.reply(m.chat, 'No puedo verificar mi propia cartera.', m)

   // Verificar si el archivo existe
   if (!fs.existsSync(filePath)) return conn.reply(m.chat, 'No hay datos de minería disponibles.', m)

   // Cargar datos desde mineria.json
   let data = JSON.parse(fs.readFileSync(filePath))

   // Verificar si el usuario está registrado en mineria.json
   if (!data[who]) return conn.reply(m.chat, 'El usuario no se encuentra en la base de datos de minería.', m)

   let dulces = data[who].dulces || 0 // Obtener dulces, o 0 si no tiene

   await m.reply(`${who == m.sender ? `Tienes *${dulces} 🍬 Dulces* en tu cartera` : `El usuario @${who.split('@')[0]} tiene *${dulces} 🍬 Dulces* en su cartera`}.`, null, { mentions: [who] })
}

handler.help = ['dulces']
handler.tags = ['rpg']
handler.command = ['wallet', 'cartera', 'dulces', 'bal', 'coins'] 
export default handler