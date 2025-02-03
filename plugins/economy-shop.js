import fs from 'fs'

const filePath = './mineria.json'
const xpperdulce = 350 // Costo de 1 Dulce en XP

const handler = async (m, { conn, command, args }) => {
    // Cargar datos desde el archivo JSON
    let data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : {}

    let sender = m.sender
    if (!data[sender]) throw '🚩 No tienes datos en el sistema. Usa un comando de minería primero.'

    // Determinar la cantidad a comprar
    let count = command.replace(/^buy/i, '')
    count = count ? /all/i.test(count) ? Math.floor(data[sender].xp / xpperdulce) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
    count = Math.max(1, count)

    if (data[sender].xp >= xpperdulce * count) {
        // Descontar XP y dar dulces
        data[sender].xp -= xpperdulce * count
        data[sender].dulce = (data[sender].dulce || 0) + count

        // Guardar cambios en el archivo JSON
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

        // Confirmación de compra
        conn.reply(m.chat, `
╔═══════⩽✰⩾═══════╗
║    𝐍𝐨𝐭𝐚 𝐃𝐞 𝐏𝐚𝐠𝐨 
╠═══════⩽✰⩾═══════╝
║╭──────────────┄
║│ *Compra Nominal* : +${count} 🍬 Dulces
║│ *Gastado* : -${xpperdulce * count} XP
║╰──────────────┄
╚═══════⩽✰⩾═══════╝`, m)
    } else {
        conn.reply(m.chat, `😔 Lo siento, no tienes suficiente *XP* para comprar *${count}* Dulces 🍬`, m)
    }
}

handler.help = ['buy', 'buyall']
handler.tags = ['economy']
handler.register = true
handler.command = ['buy', 'buyall']

handler.disabled = false

export default handler
