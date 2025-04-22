
import fetch from 'node-fetch';

const apiUrl = "https://api.agatz.xyz/api/igstalk?name=";

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args[0]) {
            return m.reply(`❌ Debes proporcionar un nombre de usuario de Instagram.\n\nEjemplo: *${usedPrefix + command} username*`);
        }

        const username = encodeURIComponent(args[0]);
        const response = await fetch(apiUrl + username);
        if (!response.ok) throw new Error('❌ Error en la API.');

        const result = await response.json();
        if (!result.username) throw new Error('❌ No se encontró información del perfil.');

        const profileInfo = `📸 *Instagram Stalker*\n\n👤 *Usuario:* ${result.username}\n📌 *Nombre:* ${result.fullname}\n📷 *Fotos:* ${result.profile_picture}\n📦 *Biografía:* ${result.biography}\n🔢 *Seguidores:* ${result.followers}\n👥 *Siguiendo:* ${result.following}\n📮 *Publicaciones:* ${result.posts}`;

        await conn.sendMessage(m.chat, { text: profileInfo }, { quoted: m });

        await conn.sendMessage(m.chat, {
            image: { url: result.profile_picture },
            caption: `📸 *Foto de perfil de ${result.username}*`
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        m.reply(`❌ Ocurrió un error al obtener la información del perfil.`);
    }
};

handler.command = /^igstalk$/i;
export default handler;
