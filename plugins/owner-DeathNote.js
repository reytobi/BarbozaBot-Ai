 let handler = async (m, { conn, args, command, usedPrefix }) =&gt; { 
    let who; 
    if (m.isGroup) { 
        if (m.mentionedJid.length &gt; 0) { 
            who = m.mentionedJid[0]; 
        } else if (m.quoted) { 
            who = m.quoted.sender; 
        } else { 
            // Permite usar el ID de usuario directamente 
            who = args[1]; 
            if (!who) throw</code><em>[❄️] Ingresa el ID de usuario o menciona al usuario que deseas modificar.</em><code>; 
            // Verificar si es un ID válido (opcional, pero recomendado) 
            if (!/^[0-9]{13,16}$/.test(who)) throw</code><em>[❄️] ID de usuario inválido.</em>`; 
        } 
    } else { 
        who = m.chat; 
    } 
<pre><code>if (!(who in global.db.data.users)) throw `*[ 🔱 ] El usuario no se encuentra en la base de datos.*`; 
 
let isAdd = false; 
if (args[0] === 'death'){ 
  isAdd = false 
}else{ 
  isAdd = args.length &gt; 0 &amp;&amp; args[args.length-1].toLowerCase() === 'true'; 
} 
 
 
global.db.data.users[who].akinator.sesi = isAdd; 
 
await m.reply(`${isAdd ? '*[ ◽ ] Usuario agregado con éxito.*' : '*[ ◽ ] Usuario eliminado con éxito.*'}`); 
``` 
}; 
handler.command = ['death', 'callar', 'mute', 'silenciar']; 
handler.group = true; 
handler.admin = true; 
handler.rowner = true; 
handler.botAdmin = true; 
export default handler; 