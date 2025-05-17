
import { downloadContentFromMessage} from '@whiskeysockets/baileys';
import fs from 'fs';

const handler = async (m, { conn}) => {
    try {
        // Verificar si el mensaje citado es una imagen
        if (!m.quoted ||!m.quoted.mimetype ||!m.quoted.mimetype.startsWith('image/')) {
            return m.reply('❌ *Error:* Responde a una imagen con el comando `.setprofile` para cambiar la foto de perfil.');
}

        // Descargar la imagen adjunta
        const media = await downloadContentFromMessage(m.quoted, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
}

        // Guardar la imagen temporalmente
        const path = './profile.jpg';
        fs.writeFileSync(path, buffer);

        // Cambiar la foto de perfil del bot y los subbots si existen
        await conn.updateProfilePicture(conn.user.id, { url: path});
        if (conn.authState.creds.me.id) { // Si hay subbots
            await conn.updateProfilePicture(conn.authState.creds.me.id, { url: path});
}

        // Confirmar el cambio con emojis
        m.reply('✅ *¡Foto de perfil actualizada con éxito!* 😃📸');

} catch (error) {
        console.error(error);
        m.reply('⚠️ *Error:* No se pudo cambiar la foto de perfil. 🛑\n' + error.message);
}
};

handler.command = /^setprofile$/i;
export default handler;