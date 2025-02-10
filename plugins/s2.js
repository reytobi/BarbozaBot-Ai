
let handler = async (m) => {
    const videos = [
        

         'https://qu.ax/kZlnj.mp4',

    ];

    // Elegir un video aleatorio
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    // Enviar el video al chat
    await conn.sendMessage(m.chat, { video: { url: randomVideo }, caption: "¡Aquí tienes un video para disfrutar!" }, { quoted: m });
}

handler.help = ['videoxxx'];
handler.tags = ['diversión'];
handler.command = ['videoxxx'];

export default handler;
```

Este código selecciona un video aleatorio de la lista que tú puedes personalizar con los enlaces que elijas. Cuando alguien usa el comando `.videoxxx`, el bot enviará uno de esos videos al chat.

Si necesitas más ayuda o quieres añadir alguna funcionalidad adicional, ¡solo dímelo! 😊