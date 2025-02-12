import fetch from 'node-fetch';
import fs from 'fs';

// Mensajes predefinidos
const mssg = {
    noText: '❗️ *Por favor, ingresa un término para buscar en TikTok.*',
    noResults: '❗️ No se encontraron resultados para tu búsqueda. Intenta con otro término. 💎🔥',
    error: '❗️ Ocurrió un error al intentar procesar la búsqueda. 🧐',
    fileNotFound: '❗️ No se pudo encontrar el video de TikTok. Asegúrate de que el enlace sea correcto.',
};

// Función para enviar respuestas rápidas
const reply = (texto, conn, m) => {
    conn.sendMessage(m.chat, {
        text: texto,
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: `MEDIAHUB 🇵🇪`,
                body: `🦅𝙈𝙀𝘿𝙄𝘼𝙃𝙐𝘽 𝙁𝙐𝙇𝙇 𝘿𝘼𝙏𝘼`,
                previewType: 'PHOTO',
                thumbnail: fs.readFileSync('./media/tiktok.jpg'),
                sourceUrl: 'https://whatsapp.com/channel/0029VatLJ9z9WtC3ReRTHw2T',
            },
        },
    }, { quoted: m });
};

// Función para buscar en TikTok con la API actualizada
const searchTikTok = async (query) => {
    try {
        const apiUrl = `https://api.siputzx.my.id/api/s/tiktok?query=${encodeURIComponent(query)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('Respuesta de la API de TikTok:', data); // Depuración para ver los datos

        if (data.status && data.data && data.data.length > 0) {
            return data.data.slice(0, 10); // Retornar los primeros 10 resultados
        }
        return null;
    } catch (error) {
        console.error('Error al buscar en TikTok:', error);
        return null;
    }
};

// Handler principal para los comandos
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) {
        return reply(mssg.noText, conn, m);
    }

    // Mensaje de búsqueda
    reply(`🔍 *Buscando en TikTok:* "${text}"...\n\n>_*MediaHub está buscando su archivo, por favor espere..._*`, conn, m);

    // Buscar en TikTok
    const searchResults = await searchTikTok(text);

    if (searchResults) {
        reply(`✅ *Se encontraron ${searchResults.length} resultados. Aquí están los videos relacionados:*`, conn, m);

        // Enviar los primeros 10 videos encontrados
        for (const result of searchResults) {
            const videoUrl = result.play; // URL del video

            try {
                // Enviar el video al usuario con solo el texto solicitado
                await conn.sendMessage(m.chat, {
                    video: { url: videoUrl },
                    caption: `Aquí tienes tu video de TikTok.\n\n_*Powered by MediaHub*_`,
                    fileName: `${result.video_id}.mp4`,
                }, { quoted: m });
            } catch (error) {
                console.error('Error al enviar video:', error.message);
            }
        }
    } else {
        return reply(mssg.noResults, conn, m);
    }
};

// Comando para activar la función de búsqueda y descarga de TikTok
handler.command = /^(Tik|tk)$/i;

export default handler;