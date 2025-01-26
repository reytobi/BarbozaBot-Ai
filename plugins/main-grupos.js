
import fetch from 'node-fetch'
let handler  = async (m, { conn, usedPrefix, command }) => {

let grupos = `*Hola!, te invito a unirte a los grupos oficiales del Bot para convivir con la comunidad* ⭐

1-Bot Barboza
*✰* https://chat.whatsapp.com/GB1m5mhAUsNF0hSKQ508ID

*─ׄ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒─ׄ─ׄ*

➠ Enlace anulado? entre aquí! 

⭐ Canal :
*✰* https://whatsapp.com/channel/0029Vaua0ZD3gvWjQaIpSy18

// Aquí se agrega la imagen
let imagen2 = https://qu.ax/LJEVX.jpg

await conn.sendFile(m.chat, imagen2, "ian.jpg", grupos, m, null, rcanal)

await m.react(emojis)

}
handler.help = ['grupos']
handler.tags = ['main']
handler.command = ['grupos', 'iangrupos', 'gruposian']
export default handler
```

¡Listo! Ahora el código incluye el enlace de la imagen. ¡Espero que esto te ayude a hacer que tu bot sea aún más divertido! 🎊 Si necesitas más ayuda, aquí estoy. ¡Boom! 💥