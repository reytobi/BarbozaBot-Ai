
import axios from 'axios';
const {
  generateWAMessageContent,
  generateWAMessageFromContent,
  proto
} = (await import("@whiskeysockets/baileys"))["default"];

let handler = async (message, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(message.chat, "🖼️ *¿Qué quieres buscar en Pinterest?*", message);
  }
  
  await message.react(rwait);
  conn.reply(message.chat, '⏬ *Descargando su imagen...*', message, {
    contextInfo: {
      externalAdReply: {
        mediaUrl: null,
        mediaType: 1,
        showAdAttribution: true,
        title: packname,
        body: wm,
        previewType: 0,
        thumbnail: icons,
        sourceUrl: channel
      }
    }
  });

  async function fetchImage(url) {
    const {
      imageMessage
    } = await generateWAMessageContent({
      'image': {
        'url': url
      }
    }, {
      'upload': conn.waUploadToServer
    });
    return imageMessage;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  let imageCards = [];
  let { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${text}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${text}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`);
  
  let imageUrls = data.resource_response.data.results.map(item => item.images.orig.url);
  shuffleArray(imageUrls);
  
  let selectedImages = imageUrls.splice(0, 5);
  let index = 1;

  for (let imageUrl of selectedImages) {
    imageCards.push({
      'body': proto.Message.InteractiveMessage.Body.fromObject({
        'text': "Imagen - " + index++
      }),
      'footer': proto.Message.InteractiveMessage.Footer.fromObject({
        'text': textbot
      }),
      'header': proto.Message.InteractiveMessage.Header.fromObject({
        'title': '',
        'hasMediaAttachment': true,
        'imageMessage': await fetchImage(imageUrl)
      }),
      'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        'buttons': [{
          'name': "cta_url",
          'buttonParamsJson': `{"display_text":"url 📫","Url":"https://www.pinterest.com/search/pins/?rs=typed&q=${text}","merchant_url":"https://www.pinterest.com/search/pins/?rs=typed&q=${text}"}` 
        }]
      })
    });
  }

  const responseMessage = generateWAMessageFromContent(message.chat, {
    'viewOnceMessage': {
      'message': {
        'messageContextInfo': {
          'deviceListMetadata': {},
          'deviceListMetadataVersion': 0x2
        },
        'interactiveMessage': proto.Message.InteractiveMessage.fromObject({
          'body': proto.Message.InteractiveMessage.Body.create({
            'text': "🔍 Resultado de: " + text
          }),
          'footer': proto.Message.InteractiveMessage.Footer.create({
            'text': "🔎 Pinterest - Búsquedas"
          }),
          'header': proto.Message.InteractiveMessage.Header.create({
            'hasMediaAttachment': false
          }),
          'carouselMessage': proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            'cards': [...imageCards]
          })
        })
      }
    }
  }, {
    'quoted': message
  });

  await message.react(done);
  await conn.relayMessage(message.chat, responseMessage.message, {
    'messageId': responseMessage.key.id
  });
};

handler.help = ["pinterest"];
handler.tags = ["descargas"];
handler.group = true;
handler.register = true;
handler.command = ['pinterest'];

export default handler;