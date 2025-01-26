import fg from 'api-dylux';

const obtenerHistoriasInstagram = async (m, { conn, args, usedPrefix, command }) => {
  // Verifica si se ingresó un nombre de usuario
  if (!args[0]) {
    return m.reply(`✳️ Ingrese un nombre de usuario\n📌Ejemplo: *${usedPrefix + command}* auronplay`);
  }

  m.react('⏳'); // Reacción mientras se procesa

  try {
    // Verifica si fg.igstory es una función
    if (typeof fg.igstory !== 'function') {
      throw new Error('fg.igstory no está definida como una función.');
    }

    // Llama a la función igstory
    let res = await fg.igstory(args[0]);

    // Verifica si hay resultados
    if (!res.results || res.results.length === 0) {
      throw new Error('No se encontraron historias para este usuario.');
    }

    // Envía las historias al chat
    for (let { url, type } of res.results) {
      await conn.sendFile(m.chat, url, 'igstory.bin', `✅ Historia de *${res.username}*`, m);
    }

    m.react('✅'); // Reacción al finalizar
  } catch (error) {
    console.error(error); // Muestra el error en la consola
    m.reply(`❌ Error: ${error.message}`); // Responde al usuario con el error
  }
};

// Definimos el handler para usar la función
let handler = async (m, { conn, args, usedPrefix, command }) => {
  await obtenerHistoriasInstagram(m, { conn, args, usedPrefix, command });
}

handler.help = ['igstory'];
handler.tags = ['dl'];
handler.command = ['igstory', 'ighistoria']; 
handler.diamond = true;

export default handler;