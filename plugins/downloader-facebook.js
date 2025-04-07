
import fetch from 'node-fetch';
import axios from 'axios';

let HS = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '❀ Ingresa un link de facebook', m);

    try {
        let api = await fetch(`https://vapis.my.id/api/fbdl?url=https://www.facebook.com/share/r/12BFZAtjpS8/?mibextid=qDwCgo{text}`);
        let json = await api.json();
        
        // Asegúrate de que la respuesta tenga los datos esperados
        if (!json.data) {
            return conn.reply(m.chat, '❀ No se pudo obtener la información del video. Verifica el enlace.', m);
        }

        let { title, durasi, hd_url } = json.data;
        let VidBuffer = await getBuffer(hd_url);
        
        let caption = `- *Título:* ${title}\n- *Duración:* ${durasi}`;

        await conn.sendMessage(m.chat, { video: VidBuffer, mimetype: "video/mp4", caption }, { quoted: m });
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❀ Ocurrió un error al intentar descargar el video.', m);
    }
};

HS.command = ['fbdl', 'fb', 'facebook', 'facebookdl'];

export default HS;

const getBuffer = async (url, options = {}) => {
    const res = await axios({ method: 'get', url, headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1 }, ...options, responseType: 'arraybuffer' });
    return res.data;
};