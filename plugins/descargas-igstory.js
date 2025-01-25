
import fg from 'api-dylux';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `✳️ Ingrese un nombre de usuario\n📌Ejemplo: *${usedPrefix + command}* auronplay`;
  
  m.react(rwait);
  
  try {
    // Verifica si fg.igstory es una función
    if (typeof fg.igstory !== 'function') {
      throw new Error('fg.igstory no está definida como una función.');
    }
    
    let res = await fg.igstory(args[0]);
    
    // Verifica si hay resultados
    if (!res.results || res.results.length === 0) {
      throw new Error('No se encontraron historias para este usuario.');
    }
    
    for (let { url, type } of res.results) {
      conn.sendFile(m.chat, url, 'igstory.bin', `✅ Historia de *${res.username}*`, m);
    }
    
    m.react(done);
  } catch (error) {
    console.error(error); // Muestra el error en la consola
    m.reply(`❌ Error: ${error.message}`);
  }
}

handler.help = ['igstory'];
handler.tags = ['dl'];
handler.command = ['igstory', 'ighistoria']; 
handler.diamond = true;

export default handler;