
     import fetch from "node-fetch";

     let handler = async (m, { conn, text }) => {
       // Validación inicial
       if (!text || typeof text !== 'string') {
         return m.reply("❌ Ingresa un nombre de usuario válido de Instagram.\nEjemplo: .igstalk username");
       }

       try {
         // Llamada a la API para obtener información del perfil de Instagram
         const apiUrl = `https://api.vreden.my.id/api/igstalk?query=${encodeURIComponent(text)}`;
         const response = await fetch(apiUrl);
         const data = await response.json();

         // Validar respuesta de la API
         if (!data?.result) {
           return m.reply("❌ No se encontró información para el usuario proporcionado.");
         }

         // Construcción del mensaje
         const userDetails = `
         📸 *Información del Usuario de Instagram*\n
         👤 *Nombre:* ${data.result.full_name || "No disponible"}
         📄 *Biografía:* ${data.result.biography || "Sin biografía"}
         🌐 *URL del Perfil:* ${data.result.external_url || "Sin enlace externo"}
         👥 *Seguidores:* ${data.result.followers || "N/A"}
         👍 *Seguidos:* ${data.result.following || "N/A"}
         📸 *Publicaciones:* ${data.result.posts || "N/A"}
         🔗 *Enlace directo:* https://instagram.com/${text}
         `;

         // Enviar imagen del perfil y detalles
         await conn.sendMessage(m.chat, {
           image: { url: data.result.profile_pic_url_hd },
           caption: userDetails.trim(),
         }, { quoted: m });

         await m.react("✅"); // Confirmación de éxito
       } catch (error) {
         console.error(error);
         await m.reply(`❌ Error al procesar la solicitud:\n${error.message}`);
       }
     };

     handler.command = ["igstalk"];
     handler.help = ["igstalk <usuario>"];
     handler.tags = ["instagram"];

     export default handler;