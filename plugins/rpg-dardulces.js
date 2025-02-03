import fs from 'fs'

const filePath = './mineria.json'
const impuesto = 0.02

let handler = async (m, { conn, text }) => {
    // Cargar datos desde el archivo JSON
    let data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : {}

    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat

    if (!who) throw '🚩 Menciona al usuario con *@user*.'

    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (!txt) throw '🚩 Ingresa la cantidad de *🍬 Dulces* que quieres transferir.'
    if (isNaN(txt)) throw '🚩 Solo se permiten números.'

    let poin = parseInt(txt)
    let imt = Math.ceil(poin * impuesto) // Calcular el impuesto
    let total = poin + imt

    if (total < 1) throw '🚩 El mínimo para donar es *1 🍬 Dulce*.'

    let sender = m.sender
    if (!data[sender]) throw '🚩 No tienes datos en el sistema. Usa un comando de minería primero.'
    if (!data[who]) throw '🚩 El usuario no tiene datos en el sistema.'

    if (total > data[sender].dulces) throw '🚩 No tienes suficientes *🍬 Dulces* para donar.'

    // Transferir dulces
    data[sender].dulces -= total
    data[who].dulces = (data[who].dulces || 0) + poin

    // Guardar cambios en el JSON
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

    // Mensajes de confirmación
    await m.reply(`✅ Has transferido *${poin}* 🍬 Dulces a @${who.split('@')[0]}.  
📌 *Impuesto (2%)*: *${imt}* 🍬 Dulces  
💰 *Total gastado*: *${total}* 🍬 Dulces`, null, { mentions: [who] })

    conn.fakeReply(m.chat, `🎁 *¡Recibiste ${poin} 🍬 Dulces!*`, who, m.text)
}

handler.help = ['dardulces *@user <cantidad>*']
handler.tags = ['rpg']
handler.command = ['dardulces', 'donardulces']

export default handler