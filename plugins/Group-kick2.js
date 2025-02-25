
let handler = async (m, { conn }) => {
    // Verifica que el mensaje sea en un grupo
    if (!m.isGroup) return m.reply('Este comando solo se puede usar en grupos.');

    // Obtiene la información del grupo y del participante que envió el mensaje
    const groupMetadata = await conn.groupMetadata(m.chat);
    const participant = groupMetadata.participants.find(p => p.id === m.sender);

    // Verifica que el usuario sea administrador
    const isAdmin = participant && participant.admin !== undefined; // Verifica si 'admin' existe
    if (!isAdmin) return m.reply('Solo los administradores pueden usar este comando.');

    const participants = groupMetadata.participants;

    // Filtra a los fantasmas (usuarios inactivos)
    const ghosts = participants.filter(member => {
        // Aquí puedes definir la lógica para determinar si alguien es un fantasma
        return member.lastSeen === 'offline' || !member.lastSeen; // Por ejemplo, si están offline o no tienen lastSeen
    });

    if (ghosts.length === 0) {
        return m.reply('No hay fantasmas para eliminar.');
    }

    for (let ghost of ghosts) {
        await conn.groupParticipantsUpdate(m.chat, [ghost.id], 'remove'); // Elimina al fantasma del grupo
    }

    m.reply(`Se han eliminado ${ghosts.length} fantasmas del grupo.`);
}

handler.help = ['kickfantasmas'];
handler.tags = ['grupo'];
handler.command = ['kickfantasmas'];

export default handler;