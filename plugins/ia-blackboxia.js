
const axios = require('axios');

const handler = async (m, { conn, command, text }) => {
    if (!text) {
        throw '🍭 𝙀𝙎𝘾𝙍𝙄𝘽𝙀 𝙀𝙇 𝙏𝙀𝙓𝙊 𝘼 𝘿𝙄𝙂𝙄𝙏𝘼𝙍.';
    }

    try {
        const response = await axios.get('https://api.siputzx.my.id/api/ai/blackboxai-pro', {
            params: { content: text }
        });

        if (response.data) {
            const aiResponse = response.data; // Aquí puedes procesar la respuesta como necesites
            m.reply(aiResponse);
        } else {
            m.reply('No se obtuvo una respuesta válida de la API.');
        }
    } catch (error) {
        console.error(error);
        m.reply('Hubo un error al conectar con la API.');
    }
};

handler.help = ['blackboxai'];
handler.tags = ['ai'];
handler.command = /^(blackboxai)$/i;

export default handler;