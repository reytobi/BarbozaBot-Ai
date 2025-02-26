
const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default;

// Definir las variables no definidas
const packname = 'Mi Paquete'; // Cambia esto por el nombre de tu paquete
const dev = 'Desarrollador'; // Cambia esto por el nombre del desarrollador
const channel = 'https://example.com'; // Cambia esto por la URL de tu canal

var handler = async (m, { conn, text }) => {
    conn.reply(m.chat, '🍭 Buscando un facto, espere un momento...', m, {
        contextInfo: {
            externalAdReply: {
                mediaUrl: null,
                mediaType: 1,
                showAdAttribution: true,
                title: packname || 'Título por defecto',
                body: dev || 'Desarrollador por defecto',
                previewType: 0,
                thumbnail: null, // Sin miniatura
                sourceUrl: channel || null
            }
        }
    });

    const randomFact = pickRandom(global.factos);
    
    const buttonMessage = {
        text: `*┏━_‌‌-‌‌-‌‌-‌‌-‌‌-‌‌-‌‌⚘-‌‌-‌‌-‌‌-‌‌-‌‌-‌‌⚘-‌‌-‌‌-‌‌-‌‌-‌‌-‌‌-‌‌⚘-‌‌-‌‌-‌‌-‌‌-‌‌_‌‌━┓*\n\n❥ *"${randomFact}"*\n\n*┗━_‌‌-‌‌-‌‌-‌‌-‌‌-҉‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌_҉⏳_҉_ᅠᅠᅠᅠᅠ_ᅠᅠⁿⁿ₁₁₁₁₁₁₁₁₁₁₁₁₁₁₁₁ ₍ ₍ ₍ ₍ ₍ ₍ ₍ ₍ ₍ ₍ ₍ ₍ ₍ ₍ ₍ ₍ 𝓢𝓱𝓸𝔀 𝓶𝓮 𝓽𝓱𝓮 𝓷𝓮𝔀 𝓯𝓪𝓬𝓽𝓸 ⚘⚘⚘⚘⚘⚘⚘⚘⚘⚘⚘⚘⚘*`, 
        footer: 'Pulsa el botón para ver otro facto:', 
        buttons: [
            { buttonId: 'next_fact', buttonText: { displayText: 'Ver siguiente facto' }, type: 1 }
        ],
        headerType: 1
    };
    
    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.help = ['facto'];
handler.tags = ['fun'];
handler.command = ['facto'];
handler.fail = null;
handler.exp = 0;
handler.register = true;

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// Definir el array global de factos
global.factos = [
    "Eres la razón por la que hay instrucciones en los champús.",
    "Si fueras un libro, serías el que nadie quiere leer.",
    "Tu vida es como un programa de televisión que nadie ve.",
    // ... (continúa con tus otros factos)
];

// Manejar el botón de "Ver siguiente facto"
handler.next_fact = async (m) => {
    const randomFact = pickRandom(global.factos);
    
    const nextFactMessage = {
        text: `*┏━_......_━┓*\n\n❥ *"${randomFact}"*\n\n*┗━_......_━┛*`,
        footer: 'Pulsa el botón para ver otro facto:',
        buttons: [
            { buttonId: 'next_fact', buttonText: { displayText: 'Ver siguiente facto' }, type: 1 }
        ],
        headerType: 1
    };
    
    await conn.sendMessage(m.chat, nextFactMessage, { quoted: m });
};