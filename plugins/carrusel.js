// COMBINACIÓN DE MENSAJES
// Adaptar el simple.js
let handler = async (m, { conn, usedPrefix }) => {

    // MENSAJE CAROUSEL CON TODOS LOS BOTONES DISPONIBLES
    const sections = [{
        title: `Título de la sección`,
        rows: [
            { header: 'Encabezado1', title: "Título1", description: 'Descripción1', id: usedPrefix + "menu" }, 
            { header: 'Encabezado2', title: "Título2", description: 'Descripción2', id: usedPrefix + "cmd2" }, 
            { header: 'Encabezado3', title: "Título3", description: 'Descripción3', id: usedPrefix + "cmd3" }, 
            { header: 'Encabezado4', title: "Título4", description: 'Descripción4', id: usedPrefix + "cmd4" }
        ]
    }];  

    const messages = [ 
        [ // CARRUSEL 1
            'Descripción de Carrusel 1', 
            'Footer de Carrusel 1',
            'https://telegra.ph/file/24b24c495b5384b218b2f.jpg',
            [['Botón1', usedPrefix + 'menu'], ['Botón2', usedPrefix + 'cmd2']],
            [['Texto para copiar 1'], ['Texto para copiar 2']],
            [['Enlace1', 'https://example.com/link1'], ['Enlace2', 'https://example.com/link2']],
            [['Botón Lista 1', sections], ['Botón Lista 2', sections]]
        ], 
        [ // CARRUSEL 2
            'Descripción de Carrusel 2',
            'Footer de Carrusel 2',
            'https://telegra.ph/file/e9239fa926d3a2ef48df2.jpg',
            [['Botón1', usedPrefix + 'cmd1'], ['Botón2', usedPrefix + 'cmd2']],
            [['Texto para copiar 1'], ['Texto para copiar 2']],
            [['Enlace1', 'https://example.com/link1'], ['Enlace2', 'https://example.com/link2']],
            [['Botón Lista 1', sections], ['Botón Lista 2', sections]]
        ], 
        [ // CARRUSEL 3
            'Descripción de Carrusel 3',
            'Footer de Carrusel 3',
            'https://telegra.ph/file/ec725de5925f6fb4d5647.jpg',
            [['Botón1', usedPrefix + 'cmd1'], ['Botón2', usedPrefix + 'cmd2']],
            [['Texto para copiar 1'], ['Texto para copiar 2']],
            [['Enlace1', 'https://example.com/link1'], ['Enlace2', 'https://example.com/link2']],
            [['Botón Lista 1', sections], ['Botón Lista 2', sections]]
        ], 
        [ // CARRUSEL 4
            'Descripción de Carrusel 4',
            'Footer de Carrusel 4',
            'https://telegra.ph/file/7acad0975febb71446da5.jpg',
            [['Botón1', usedPrefix + 'cmd1'], ['Botón2', usedPrefix + 'cmd2']],
            [['Texto para copiar 1'], ['Texto para copiar 2']],
            [['Enlace1', 'https://example.com/link1'], ['Enlace2', 'https://example.com/link2']],
            [['Botón Lista 1', sections], ['Botón Lista 2', sections]]
        ]
    ];

    if (typeof conn.sendCarousel === 'function') {
        await conn.sendCarousel(m.chat, 'Texto', 'Footer', 'Título de Carrusel', messages, m);
    } else {
        await conn.reply(m.chat, 'La función sendCarousel no está definida en conn.', m);
    }
};

handler.command = /^(carousel)$/i;
export default handler;