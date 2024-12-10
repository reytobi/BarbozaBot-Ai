import fetch from 'node-fetch'

export async function before(m, { conn }) {
let name = '⛄𝑩𝒐𝒕𝑩𝒂𝒓𝒃𝒐𝒛𝒂 𝑴𝑫 - 𝑪𝒉𝒂𝒏𝒏𝒆𝒍🌲'
let imagenes = ["https://i.ibb.co/f9kvM3S/file.jpg",
"https://i.ibb.co/wCPxV2D/file.jpg",
"https://i.ibb.co/wCPxV2D/file.jpg",
"https://i.ibb.co/FDyNygX/file.jpg"]

let icono = imagenes[Math.floor(Math.random() * imagenes.length)]

//Imagen
let category = "imagen"
const database = './storage/databases/database.json'
const database_ = JSON.parse(fs.readFileSync(db))
const random = Math.floor(Math.random() * database_.links[category].length)
const randomlink = db_.links[category][random]
const response = await fetch(randomlink)
const rimg = await response.buffer()
global.icons = rimg


global.rcanal = {
 contextInfo: {
             isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363375378707428@newsletter",
      serverMessageId: 100,
      newsletterName: name,
   }, 
   externalAdReply: {
    showAdAttribution: true, 
    title: botname, 
    body: textbot, 
    mediaUrl: null, 
    description: null, 
    previewType: "PHOTO", 
    thumbnailUrl: icono, 
    sourceUrl: canal, 
    mediaType: 1, 
    renderLargerThumbnail: false }, 
    }, 
    }

 global.fake = {
    contextInfo: {
            isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363317263885467@newsletter",
      serverMessageId: 100,
      newsletterName: name,
    },
    },
  }
}