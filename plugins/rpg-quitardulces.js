
let handler = async (m, { conn, text }) => {
    let quien;
    if (m.isGroup) quien = m.mentionedJid[0];
    else quien = m.chat;

    if (!quien) throw '🚩 Menciona al usuario con *@user.*';

    let txt = text.replace('@' + quien.split('@')[0], '').trim();
    if (!txt) throw '🚩 Ingresa la cantidad de *🍬 Dulces* que quieres quitar.';
    
    if (isNaN(txt)) throw 'Solo se permiten números.';
    
    let dulcesQuitados = parseInt(txt);
    
    let users = global.db.data.users;

    // Verificar si el usuario tiene suficientes dulces para quitar
    if (users[quien].dulces < dulcesQuitados) throw `${quien.split('@')[0]} no tiene suficientes *🍬 Dulces* para quitar.`;
    
    // Restar dulces al usuario mencionado
    users[quien].dulces -= dulcesQuitados;

    // Respuesta al usuario
    await m.reply(`🔻 Has quitado *${dulcesQuitados}* dulces a ${quien.split('@')[0]}!`);
}

handler.help = ['quitarDulces *@user <cantidad>*'];
handler.tags = ['economía'];
handler.command = ['quitarDulces', 'restarDulces'];

export default handler;