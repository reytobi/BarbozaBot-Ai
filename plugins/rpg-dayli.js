import fs from 'fs'

const freeXP = 50000
const premXP = 100000
const cooldowns = {}
const filePath = './mineria.json'

// Verifica si el archivo existe, si no, lo crea
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({}, null, 2))
}

let handler = async (m, { conn, isPrems }) => {
  let data = JSON.parse(fs.readFileSync(filePath)) // Cargar datos de minería

  const tiempoEspera = 24 * 60 * 60 // 24 horas
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    const tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    conn.reply(m.chat, `🚩 Ya has realizado tu pedido gratis de hoy.\nRecuerda que solo puedes realizarlo 1 vez cada 24 horas.\n\n*Próximo Monto* : +${isPrems ? premXP : freeXP} 💫 XP\n*En* : ⏱ ${tiempoRestante}`, m)
    return
  }

  let xp = isPrems ? premXP : freeXP
  let barbozaCoins = Math.floor(Math.random() * (100 - 50 + 1)) + 50
  let diamantes = Math.floor(Math.random() * (40 - 20 + 1)) + 20
  let dulce = Math.floor(Math.random() * (300 - 50 + 1)) + 50 // Aumentado el rango de dulces

  // Asegurar que el usuario tiene datos en el JSON
  if (!data[m.sender]) {
    data[m.sender] = { xp: 0, barbozaCoins: 0, diamantes: 0, dulce: 0 }
  }

  // Sumar recompensas
  data[m.sender].exp += exp
  data[m.sender].barbozaCoins += barbozaCoins
  data[m.sender].diamantes += diamantes
  data[m.sender].limit += limit

  // Guardar datos actualizados en mineria.json
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

  let txt = `🎁 *¡Recompensa Diaria para ${conn.getName(m.sender)}!*
▢ *Obtuviste:*
┠ ➺ *${barbozaCoins}* 🪙 Monedas
┠ ➺ *${diamantes}* 💎 Diamantes
┠ ➺ *${dulce}* 🍬 Dulces
┖ ➺ *${exp}* 💫 XP`

  await m.react('🎉')
  await conn.reply(m.chat, txt, m)

  cooldowns[m.sender] = Date.now()
}

handler.help = ['claim']
handler.tags = ['fun']
handler.command = ['daily', 'claim']
handler.register = true

export default handler

function segundosAHMS(segundos) {
  const horas = Math.floor(segundos / 3600)
  const minutos = Math.floor((segundos % 3600) / 60)
  const segundosRestantes = segundos % 60
  return `${horas} horas, ${minutos} minutos y ${segundosRestantes} segundos`;
}
