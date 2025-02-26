
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
    conn.reply(m.chat, `*┏━_‌‌-‌‌-‌‌-‌‌-‌‌-‌‌-‌‌⚘-‌‌-‌‌-‌‌-‌‌-‌‌-‌‌⚘-‌‌-‌‌-‌‌-‌‌-‌‌-‌‌-‌‌⚘-‌‌-‌‌-‌‌-‌‌-‌‌_‌‌━┓*\n\n❥ *"${randomFact}"*\n\n*┗━_‌­­­_ ‒ ‒ ‒ ‒ ‒ ‒ ‒ ⚘ ‒ ‒ ‒ ‒ ‒ ‒ ‒ ⚘ _  _  _  _  _  _  _  _  _  _  _ ┛*`, m, {
        contextInfo: {
            buttonText: {
                displayText: '👤 FACTO',
            },
            footer: dev,
            buttons: [
              {
                  buttonId: '.facto',
                  buttonText: { displayText: '👤 FACTO' },
              },
              {
                  buttonId: '.facto',
                  buttonText: { displayText: '☁️ VER SIGUIENTE FACTO' },
              },
            ],
            viewOnce: true,
            headerType: 4,
        }
    });
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
    // ... (el resto de los factos)
];

