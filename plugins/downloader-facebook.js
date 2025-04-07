
import fetch from 'node-fetch';
import axios from 'axios';

let HS = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '📌 Atención futuro cliente proporcione un link de facebook para descargar su video', m);

    try {
        let api = await fetch(`https://vapis.my.id/api/fbdl?url=${text}`);
        let json = await api.json();

        if (!json.data) {
            return conn.reply(m.chat, '📌 No se descargó el vídeo. Verifica el enlace.', m);
        }

        let { title, durasi, hd_url, size, upload_date } = json.data;
        let VidBuffer = await getBuffer(hd_url);

        let caption = `- *Título:* ${title}\n- *Duración:* ${durasi}\n- *Tamaño:* ${size}\n- *Fecha de Publicación:* ${upload_date}`;

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
```

Con estos cambios, al recibir un video desde Facebook podrás mostrar no solo el título y la duración, sino también el tamaño del archivo y la fecha de publicación. Asegúrate de que esos datos estén disponibles en la respuesta de la API que estás utilizando.

Si necesitas más ayuda o si hay algo específico que te gustaría agregar o modificar, ¡dímelo!