
import db from '../lib/database.js'

let handler = async (m, { conn, text }) => {
    let who;
    if (m.isGroup) who = m.mentionedJid[0];
    else who = m.chat;

    if (!who) throw '🚩 Menciona al usuario con *@user.*';

    let txt = text.replace('@' + who.split('@')[0], '').trim();
    if (!txt) throw '🚩 Ingrese la cantidad de *🍬 Dulces* que quiere quitar.';
    
    if (isNaN(txt)) throw 'Sólo números.';
    
    let dulcesQuitados = parseInt(txt);
    
    let users = global.db.data.users;

    // Verificar si el usuario tiene suficientes dulces para quitar
    if (users[who].dulces < dulcesQuitados) throw `${who.split('@')[0]} no tiene suficientes *🍬 Dulces* para quitar.`;
    
    // Restar dulces al usuario mencionado
    users[who].dulces -= dulcesQuitados;

    // Respuesta al usuario
    await m.reply(`🔻 Has quitado *${dulcesQuitados}* dulces a ${who.split('@')[0]}!`);
}

handler.help = ['quitarDulces *@user <cantidad>*'];
handler.tags = ['economía'];
handler.command = ['quitarDulces', 'restarDulces'];

export default handler;