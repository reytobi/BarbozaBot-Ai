📜 *Código del comando ytmp3:*

```case 'ytmp3': {
    const fs = require('fs');
    const path = require('path');
    const fetch = require('node-fetch');
    const savetube = require('savetubedl');

    if (!text) {
        await sock.sendMessage(msg.key.remoteJid, {
            text: `⚠️ Uso incorrecto del comando.\n\n📌 Ejemplo: *${prefix}ytmp3* https://www.youtube.com/watch?v=ejemplo`
        }, { quoted: msg });
        return;
    }

    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(text)) {
        await sock.sendMessage(msg.key.remoteJid, {
            text: `⚠️ Enlace no válido.\n\n📌 Asegúrese de ingresar una URL de YouTube válida.\n\nEjemplo: *${prefix}ytmp3* https://www.youtube.com/watch?v=ejemplo`
        }, { quoted: msg });
        return;
    }

    await sock.sendMessage(msg.key.remoteJid, {
        react: { text: '⏳', key: msg.key }
    });

    const videoUrl = text;

    try {
        const result = await savetube.ytdlaud(videoUrl);

        if (!result.status || !result.response || !result.response.descarga) {
            throw new Error();
        }

        const videoInfo = result.response;
        const tmpDir = path.join(__dirname, 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

        const filePath = path.join(tmpDir, `${Date.now()}.mp3`);

        const response = await fetch(videoInfo.descarga);
        if (!response.ok) throw new Error();

        const buffer = await response.buffer();
        fs.writeFileSync(filePath, buffer);

        const fileSize = fs.statSync(filePath).size;
        if (fileSize < 10000) {
            fs.unlinkSync(filePath);
            throw new Error();
        }

        await sock.sendMessage(msg.key.remoteJid, {
            audio: fs.readFileSync(filePath),
            mimetype: 'audio/mpeg',
            fileName: `${videoInfo.titulo}.mp3`
        }, { quoted: msg });

        fs.unlinkSync(filePath);

        await sock.sendMessage(msg.key.remoteJid, {
            react: { text: '✅', key: msg.key }
        });

    } catch {
        await sock.sendMessage(msg.key.remoteJid, {
            react: { text: '❌', key: msg.key }
        });
    }
    break;```