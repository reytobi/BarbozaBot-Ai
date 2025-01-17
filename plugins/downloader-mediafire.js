import fetch from 'node-fetch';

// Mensajes predefinidos
const mssg = {
    noLink: '❗️ *Por favor, ingresa un enlace válido de Mediafire.*',
    invalidLink: '❗️ El enlace proporcionado no es válido. Por favor, verifica.',
    error: '❗️ Ocurrió un error al procesar la descarga. 🧐',
    fileNotFound: '❗️ No se encontró el archivo. Asegúrate de que el enlace sea correcto.',
    fileTooLarge: '❗️ El archivo supera los 650 MB. No se puede procesar.',
    busy: '❗️ Servidor ocupado, espera un momento.',
};

// Estado del servidor
let isProcessing = false;

// Verifica si el enlace es válido
const isValidUrl = (url) => /^(https?:\/\/)?(www\.)?mediafire\.com\/.*$/i.test(url);

// Extrae nombre del archivo del enlace
const extractFileName = (url) => {
    const match = url.match(/\/file\/[^/]+\/(.+?)\/file$/i);
    return match ? decodeURIComponent(match[1].replace(/%20/g, ' ')) : 'archivo_descargado';
};

// Determina el MIME según extensión
const getMimeType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const mimeTypes = {
        apk: 'application/vnd.android.package-archive',
        zip: 'application/zip',
        rar: 'application/vnd.rar',
        mp4: 'video/mp4',
        jpg: 'image/jpeg',
        png: 'image/png',
        pdf: 'application/pdf',
        mp3: 'audio/mpeg',
    };
    return mimeTypes[ext] || 'application/octet-stream';
};

// URL de la API (protegida en Base64)
const apiBase64 = 'aHR0cHM6Ly93d3cuZGFyay15YXNpYS1hcGkuc2l0ZS9kb3dubG9hZC9tZmlyZT91cmw9';

// Respuesta rápida
const reply = (texto, conn, m) => conn.sendMessage(m.chat, { text: texto }, { quoted: m });

// Handler principal
let handler = async (m, { conn, text, command }) => {
    if (!text) return reply(mssg.noLink, conn, m);
    if (isProcessing) return reply(mssg.busy, conn, m);
    if (!isValidUrl(text)) return reply(mssg.invalidLink, conn, m);

    try {
        isProcessing = true;
        console.log(`[BarbozaBot-Ai] Procesando: ${text}`);
        const fileName = extractFileName(text);
        const apiUrl = `${Buffer.from(apiBase64, 'base64').toString()}${encodeURIComponent(text)}`;
        const { status, result } = await (await fetch(apiUrl)).json();

        if (status && result?.dl_link) {
            const { dl_link: downloadUrl, size } = result;
            if (parseFloat(size.replace(/[^0-9.]/g, '')) > 650) return reply(mssg.fileTooLarge, conn, m);

            const mimeType = getMimeType(fileName);
            const infoMessage = `
                𝐌𝐄𝐃𝐈𝐀𝐅𝐈𝐑𝐄 - 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑
                
                │  ✦ *Nombre:* ${fileName}
                │  ✦ *Peso:* ${size}
                │  ✦ *Tipo:* ${mimeType}
                
                ╚──────────────
                > 📱Enviado por *BarbozaBot-Ai* desarrollado por MediaHubOficial.
                > 💡 *Espere un momento, el archivo está siendo enviado.*`;

            reply(infoMessage.trim(), conn, m);

            await conn.sendMessage(m.chat, {
                document: { url: downloadUrl },
                mimetype: mimeType,
                fileName: fileName,
            }, { quoted: m });

        } else {
            reply(mssg.fileNotFound, conn, m);
        }

    } catch (error) {
        console.error(`[MediaHubOficial] Error: ${error.message}`);
        reply(mssg.error, conn, m);
    } finally {
        isProcessing = false;
    }
};

handler.command = /^(mediafire|mfire)$/i;

export default handler;
