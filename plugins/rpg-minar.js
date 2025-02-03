import fs from 'fs'

let cooldowns = {}
const filePath = './mineria.json'

// Verifica si el archivo existe, si no, lo crea
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({}, null, 2))
}

let handler = async (m, { conn }) => {
  let data = JSON.parse(fs.readFileSync(filePath)) // Cargar datos de minería

  let name = conn.getName(m.sender)
  let tiempoEspera = 5 * 60 // 5 minutos
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    conn.reply(m.chat, `🚩 Hola ${name}, ya has minado recientemente, espera ⏱ *${tiempoRestante}* para regresar a la mina.`, m)
    return
  }

  let xp = 9999999999 
  let barbozaCoins = 9999999999
  let diamantes = 9999999999
  let dulces = 9999999999

  // Asegurar que el usuario tiene datos en el JSON
  if (!data[m.sender]) {
    data[m.sender] = { xp: 0, barbozaCoins: 0, diamantes: 0, dulces: 0 }
  }

  // Sumar recompensas
  data[m.sender].xp += xp
  data[m.sender].barbozaCoins += barbozaCoins
  data[m.sender].diamantes += diamantes
  data[m.sender].dulces += dulces

  // Guardar datos actualizados
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

  let txt = `🎮 *¡HACK EXITOSO ${name.toUpperCase()}!*
▢ *Recompensa Máxima:*
┠ ➺ *${barbozaCoins}* 🪙 Monedas
┠ ➺ *${diamantes}* 💎 Diamantes
┠ ➺ *${xp}* 💫 XP
┖ ➺ *${dulces}* 🍬 Dulces`

  await m.react('💥')
  await conn.reply(m.chat, txt, m)

  cooldowns[m.sender] = Date.now()
}

handler.help = ['hack']
handler.tags = ['fun']
handler.command = ['hack', 'hackear', 'hackear']
handler.register = true
export default handler

function segundosAHMS(segundos) {
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}