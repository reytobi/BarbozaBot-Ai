import fetch from 'node-fetch';
import yts from "yt-search";
const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`• Ejemplo: ${usedPrefix + command} elaina edit`);
    await m.react('🕓');

    let results = await yts(text);
    let videos = results.videos.slice(0, 5); // Limitamos a 5 resultados

    let messages = videos.map(video => [
        `◦ *Título:* ${video.title}\n◦ *Duración:* ${video.timestamp}\n◦ *Vistas:* ${video.views}`,
        'Selecciona una opción para descargar:',
        video.thumbnail,
        [['Descargar Audio 🎧', `.ytmp3 ${video.url}`], ['Descargar Video 📹', `.ytmp4 ${video.url}`]],
        [['Copiar Comando Audio', `.ytmp3 ${video.url}`], ['Copiar Comando Video', `.ytmp4 ${video.url}`]],
        [['Ver en YouTube', video.url]]
    ]);

    let sections = messages.map(([description, footer, image, buttons, copyButtons, links]) => ({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: description }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: footer }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
            title: '',
            hasMediaAttachment: true,
            imageMessage: (async () => {
                let imgBuffer = await (await fetch(image)).buffer();
                const { imageMessage } = await generateWAMessageFromContent(m.chat, {
                    image: imgBuffer
                }, { upload: conn.waUploadToServer });
                return imageMessage;
            })()
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
            buttons: [
                ...buttons.map(([text, id]) => ({
                    name: "cta_reply",
                    buttonParamsJson: JSON.stringify({ display_text: text, id })
                })),
                ...copyButtons.map(([text, copy_code]) => ({
                    name: "cta_copy",
                    buttonParamsJson: JSON.stringify({ display_text: text, copy_code })
                })),
                ...links.map(([text, url]) => ({
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({ display_text: text, url })
                }))
            ]
        })
    }));

    const botMessage = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                    body: proto.Message.InteractiveMessage.Body.create({ text: `*🎵 Resultados para:* *${text}*` }),
                    footer: proto.Message.InteractiveMessage.Footer.create({ text: 'Elige una opción para continuar:' }),
                    header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
                    carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: sections })
                })
            }
        }
    }, { quoted: m });

    await conn.relayMessage(m.chat, botMessage.message, { messageId: botMessage.key.id });
    await m.react('✅');
};

handler.help = ["ytsearch <texto>", "yts <texto>"];
handler.tags = ["search"];
handler.command = ["ytsearch", "yts"];

export default handler;