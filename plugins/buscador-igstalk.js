
const axios = require('axios'); // Asegúrate de tener axios instalado

var handler = async (m, { conn, command, text }) => {
    if (!text) throw '🍭 𝙀𝙎𝘾𝙍𝙄𝘽𝙀 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝘿𝙊𝙎 𝙋𝙀𝙍𝙎𝙊ℕ𝘼𝙎 𝘼 𝗖𝗔𝗟𝗖𝗨𝗟𝗔𝗥 𝗦𝗨 𝗔𝗠𝗢𝗥.'

    try {
        const response = await axios.get(`https://api.diioffc.web.id/api/download/instagram?username=${text}`);
        const data = response.data;

        if (data) {
            let info = `
            📸 *Nombre:* ${data.full_name}
            📝 *Biografía:* ${data.biography}
            📊 *Seguidores:* ${data.followers}
            👥 *Siguiendo:* ${data.following}
            🔗 *Enlace:* ${data.external_url}
            `.trim();

            m.reply(info);
        } else {
            throw 'No se encontró información para este usuario.';
        }
    } catch (error) {
        console.error(error);
        m.reply('Ocurrió un error al obtener la información. Verifica el nombre de usuario.');
    }
}

handler.help = ['igstalk <usuario>'];
handler.tags = ['fun'];
handler.command = /^(igstalk)$/i;

export default handler;