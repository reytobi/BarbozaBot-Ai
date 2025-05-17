
import { downloadContentFromMessage} from '@whiskeysockets/baileys';
import fs from 'fs';

const handler = async (m, { conn}) => {
    if (!m.quoted ||!m.quoted.mimetype ||!m.quoted.mimetype.startsWith('image/')) {
        return m.reply('Por favor, responde a una imagen con el comando.setprofile.');
}

    try {
        const media = await downloadContentFromMessage(m.quoted, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
}

        const path = './profile.jpg';
        fs.writeFileSync(path, buffer);

        await conn.updateProfilePicture(conn.user.id, { url: path});
        m.reply('¡Foto de perfil cambiada exitosamente!');
} catch (error) {
        m.reply('Error al cambiar la foto de perfil: ' + error.message);
}
};

handler.command = /^setprofile$/i;
export default handler;