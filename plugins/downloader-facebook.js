/*
- Código By Barboza 
- 🌙 Moon Force Team 
-   https://whatsapp.com/channel/0029Vb4Dnh611ulGUbu7Xg1q
*/
import fetch from 'node-fetch';
import axios from 'axios';

let HS = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '📌Atención futuro cliente proporcione un link de facebook para descargar su video', m);

    try {
        let api = await fetch(`https://delirius-apiofc.vercel.app/download/facebook?url=${text}`);
        let json = await api.json();

        if (!json.data) {
            return conn.reply(m.chat, '📌 No se descargo el vídeo . Verifica el enlace.', m);
        }

        let { title, durasi, hd_url } = json.data;
        let VidBuffer = await getBuffer(hd_url);

        let caption = `- *Título:* ${title}\n- *Duración:* ${durasi}`;

        await conn.sendMessage(m.chat, { video: VidBuffer, mimetype: "video/mp4", caption }, { quoted: m });
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '📌 Ocurrió un error inesperado contacta con el creador.', m);
    }
};

HS.command = ['fbdl', 'fb', 'facebook', 'facebookdl'];

export default HS;

const getBuffer = async (url, options = {}) => {
    const res = await axios({ method: 'get', url, headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1 }, ...options, responseType: 'arraybuffer' });
    return res.data;
};