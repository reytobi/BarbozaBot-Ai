import fg from 'api-dylux';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Verifica si se ingresó un nombre de usuario
  if (!args[0]) throw `✳️ Ingrese un nombre de usuario\n📌Ejemplo: *${usedPrefix + command}* auronplay`;

  m.react(rwait); // Reacción mientras se procesa

  try {
    // Verifica si fg.igstory está disponible como función
    if (fg && typeof fg.igstory === 'function') {
      // Llama a la función igstory
      let res = await fg.igstory(args[0]);

      // Verifica si hay resultados
      if (!res.results || res.results.length === 0) {
        throw new Error('No se encontraron historias para este usuario.');
      }

      // Envía las historias al chat
      for (let { url, type } of res.results) {
        conn.sendFile(m.chat, url, 'igstory.bin', `✅ Historia de *${res.username}*`, m);
      }

      m.react(done); // Reacción al finalizar
    } else {
      throw new Error('La función igstory no está disponible o no se ha definido correctamente en el paquete.');
    }
  } catch (error) {
    console.error(error); // Muestra el error en la consola
    m.reply(`❌ Error: ${error.message}`); // Responde al usuario con el error
  }
}

handler.help = ['igstory'];
handler.tags = ['dl'];
handler.command = ['igstory', 'ighistoria']; 
handler.diamond = true;

export default handler;