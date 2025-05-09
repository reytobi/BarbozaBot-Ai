const timeout = 60000 // Creado Por Barboza MD Tu Papá 🟢
const reward = { dolares: 30, coins: 20, diamantes: 1 }

const mate = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  const operaciones = ['+', '-', '×']
  const operacion = operaciones[Math.floor(Math.random() * operaciones.length)]

  let resultado
  switch (operacion) {
    case '+': resultado = num1 + num2; break
    case '-': resultado = num1 - num2; break
    case '×': resultado = num1 * num2; break
  }

  const pregunta = `${num1} ${operacion} ${num2}`
  conn.mathGame = conn.mathGame || {}
  conn.mathGame[m.chat] = {
    resultado,
    timeout: setTimeout(() => {
      if (conn.mathGame[m.chat]) {
        conn.reply(m.chat, `╭━〔 *⧼ ᴍᴀᴛᴇᴍᴀ́ᴛɪᴄᴀꜱ ⧽* 〕━⬣
┃ ⏰ Tiempo agotado.
┃ ✅ La respuesta correcta era *${resultado}*.
╰━〔 *Barboza-Bot* 〕━⬣`, m)
        delete conn.mathGame[m.chat]
      }
    }, timeout)
  }

  return conn.reply(m.chat, `╭━〔 *⧼ ᴍᴀᴛᴇᴍᴀ́ᴛɪᴄᴀꜱ ⧽* 〕━⬣
┃ 🧠 Resuelve esta operación:
┃ 
┃ ➤ *${pregunta} = ?*
┃ ⏳ Tienes *60 segundos* para responder.
╰━〔 *Barboza-Bot* 〕━⬣`, m)
}

mate.before = async (m, { conn }) => {
  if (conn.mathGame && conn.mathGame[m.chat]) {
    const respuesta = parseInt(m.text.trim())
    if (respuesta === conn.mathGame[m.chat].resultado) {
      const user = global.db.data.users[m.sender]
      user.dolares = (user.dolares || 0) + reward.dolares
      user.coins = (user.coins || 0) + reward.coins
      user.diamantes = (user.diamantes || 0) + reward.diamantes

      clearTimeout(conn.mathGame[m.chat].timeout)
      delete conn.mathGame[m.chat]

      return conn.reply(m.chat, `╭━〔 *⧼ ᴍᴀᴛᴇᴍᴀ́ᴛɪᴄᴀꜱ ⧽* 〕━⬣
┃ ✅ ¡Respuesta correcta!
┃ 🎉 Has ganado:
┃ 💵 +${reward.dolares} Dólares
┃ 🪙 +${reward.coins} Coins
┃ 💎 +${reward.diamantes} Diamante
╰━〔 *Barboza-Bot* 〕━⬣`, m)
    } else if (!isNaN(respuesta)) {
      return conn.reply(m.chat, `❌ Respuesta incorrecta. Intenta de nuevo.`, m)
    }
  }
}

mate.help = ['mate']
mate.tags = ['juegos']
mate.command = /^mate$/i
export default mate