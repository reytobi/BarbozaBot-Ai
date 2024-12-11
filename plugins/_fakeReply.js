import fetch from 'node-fetch'

export async function before(m, { conn }) {
let name = '⛄𝑩𝒐𝒕𝑩𝒂𝒓𝒃𝒐𝒛𝒂 𝑴𝑫 - 𝑪𝒉𝒂𝒏𝒏𝒆𝒍🌲'
let imagenes = ["https://i.ibb.co/f9kvM3S/file.jpg",
"https://i.ibb.co/wCPxV2D/file.jpg",
"https://i.ibb.co/wCPxV2D/file.jpg",
"https://i.ibb.co/FDyNygX/file.jpg"]

let icono = imagenes[Math.floor(Math.random() * imagenes.length)]

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


global.icono = [ 
'https://qu.ax/yyCo.jpeg',
'https://qu.ax/yyCo.jpeg',
'https://qu.ax/qJch.jpeg',
'https://qu.ax/qJch.jpeg',
'https://qu.ax/CHRS.jpeg',
'https://qu.ax/CHRS.jpeg',
].getRandom()

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