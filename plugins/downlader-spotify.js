let handler = async (m, { conn, args, isPrems, isOwner, usedPrefix, command }) => {
    if (!args[0]) return conn.reply(m.chat, `\`\`\`[ 🌼 ] Por favor ingresa un link de Spotify. Ejemplo:\n${usedPrefix + command} https://open.spotify.com/intl-es/track/0P0BTqkBQuAlzbwbTEV57m\`\`\``, null, fkontak);
    
    m.react('❄️');
    let api = await fetch(`https://api.ryzendesu.vip/api/downloader/spotify?url=${args[0]}`);
    let res = await api.json();

    if (res.data) {
        let { title, duration, url, thumbnail } = res.data;
        let { name: artistName } = res.data.artist; // Cambiar el nombre a artistName
        let text = `╭━━━⊜ ⌊ \`Spotify Download\` ⌉⊜━━━\n`;
        text += `│  ≡ Nombre: \`${title}\`\n`;
        text += `│  ≡ Duración: \`${duration}\`\n`;
        text += `│  ≡ Artista: \`${artistName}\`\n`; // Usar artistName aquí
        text += `╰━━━━━━━━━━━━━━⊜\n`;
        text += `  _Enviando el archivo . . . ._\n- \`${botname}\` -`;
        conn.sendFile(m.chat, thumbnail, title + '.jpg', text, m, null, rpl);
        
        /*************/
        await conn.sendMessage(m.chat, { audio: { url: url } }, { quoted: fkontak });
        m.react('✅');
    } else {
        conn.reply(m.chat, `\`\`\`[ 🚫 ] No se pudo obtener la información de Spotify. Asegúrate de que el enlace sea correcto.\`\`\``, null, fkontak);
        m.react('❌');
    }
}

handler.help = ['spotifydl', 'spotify'];
handler.tags = ['downloader'];
handler.command = ['spotifydl', 'spotify'];
handler.prem = true;
export default handler;