import fs from 'fs'

let cooldowns = {}
const filePath = './mineria.json'

// Verifica si el archivo existe, si no, lo crea
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({}, null, 2))
}

let handler = async (m, { conn }) => {
  let data = JSON.parse(fs.readFileSync(filePath)) // Cargar datos de minería
  
  let senderId = m.sender
  let senderName = conn.getName(senderId)

  let tiempoEspera = 5 * 60 // 5 minutos
  if (cooldowns[senderId] && Date.now() - cooldowns[senderId] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[senderId] + tiempoEspera * 1000 - Date.now()) / 1000))
    m.reply(`🚩 Ya has cometido un crimen recientemente, espera *⏱ ${tiempoRestante}* para volver a intentarlo.`)
    return
  }

  cooldowns[senderId] = Date.now()

  let randomUserId = Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)]
  while (randomUserId === senderId) {
    randomUserId = Object.keys(data)[Math.floor(Math.random() * Object.keys(data).length)]
  }

  let minAmount = 15
  let maxAmount = 50

  let amountTaken = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount
  let randomOption = Math.floor(Math.random() * 3)

  let xp = Math.floor(Math.random() * 5000)
  let barbozaCoins = Math.floor(Math.random() * (70 - 40 + 1)) + 40
  let diamantes = Math.floor(Math.random() * (30 - 10 + 1)) + 10
  let dulces = Math.floor(Math.random() * (10 - 5 + 1)) + 5

  if (!data[senderId]) {
    data[senderId] = { xp: 0, barbozaCoins: 0, diamantes: 0, dulces: 0 }
  }
  if (!data[randomUserId]) {
    data[randomUserId] = { xp: 0, barbozaCoins: 0, diamantes: 0, dulces: 0 }
  }

  switch (randomOption) {
    case 0:
      data[senderId].barbozaCoins += amountTaken
      data[randomUserId].barbozaCoins -= amountTaken
      data[senderId].xp += xp
      data[senderId].diamantes += diamantes
      data[senderId].dulces += dulces
      conn.sendMessage(m.chat, {
        text: `🚩 *¡Crimen Exitoso ${senderName}!*\n\nLograste robar *${amountTaken} 🪙 Monedas* de @${randomUserId.split("@")[0]}.\n\n🎁 *Recompensas adicionales:*\n➜ *${xp}* 💫 XP\n➜ *${diamantes}* 💎 Diamantes\n➜ *${dulces}* 🍬 Dulces`,
        contextInfo: { mentionedJid: [randomUserId] }
      }, { quoted: m })
      break

    case 1:
      let amountSubtracted = Math.min(amountTaken, data[senderId].barbozaCoins)
      data[senderId].barbozaCoins -= amountSubtracted
      conn.reply(m.chat, `🚩 *¡Te atraparon, ${senderName}!*\nPerdiste *-${amountSubtracted} 🪙 Monedas* mientras intentabas cometer un crimen.`, m)
      break

    case 2:
      let smallAmountTaken = Math.min(Math.floor(amountTaken / 2), data[randomUserId].barbozaCoins)
      data[senderId].barbozaCoins += smallAmountTaken
      data[randomUserId].barbozaCoins -= smallAmountTaken
      data[senderId].xp += xp
      data[senderId].diamantes += Math.floor(diamantes / 2)
      data[senderId].dulces += Math.floor(dulces / 2)
      conn.sendMessage(m.chat, {
        text: `🚩 *¡Crimen Parcialmente Exitoso ${senderName}!*\n\nLograste robar *${smallAmountTaken} 🪙 Monedas* de @${randomUserId.split("@")[0]}, pero fuiste descubierto y tuviste que escapar rápido.\n\n🎁 *Recompensas adicionales:*\n➜ *${xp}* 💫 XP\n➜ *${Math.floor(diamantes / 2)}* 💎 Diamantes\n➜ *${Math.floor(dulces / 2)}* 🍬 Dulces`,
        contextInfo: { mentionedJid: [randomUserId] }
      }, { quoted: m })
      break
  }

  // Guardar datos actualizados en mineria.json
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

  global.db.write()
}

handler.tags = ['rpg']
handler.help = ['crimen']
handler.command = ['crimen', 'crime']
handler.register = true
handler.group = true

export default handler

function segundosAHMS(segundos) {
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}