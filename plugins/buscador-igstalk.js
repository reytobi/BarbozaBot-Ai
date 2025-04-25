
import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("❌ Ingresa un nombre de usuario válido de Instagram.\nEjemplo: .igstalk Shakira");
  }

  try {
    // Llamada a la API para obtener información del perfil de Instagram
    const apiUrl = `https://delirius-apiofc.vercel.app/tools/igstalk?username=${encodeURIComponent(text)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Validar respuesta de la API
    if (!data?.result) {
      return m.reply("❌ No se encontró información para el usuario proporcionado.");
    }

    // Construir mensaje con los detalles del usuario
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
```

---

*Explicación del Código*
1. *Validación de Entrada* :
   - El comando verifica que el usuario proporcione un nombre válido antes de llamar a la API.

2. *Uso de la API* :
   - Realiza la consulta al endpoint de la API para obtener los datos del perfil del usuario.

3. *Respuesta Detallada* :
   - Proporciona información como nombre completo, biografía, seguidores, seguidos y publicaciones del perfil.

4. *Envío de Imagen y Detalles* :
   - La imagen de perfil se envía junto con la información del usuario en el chat.

5. *Gestión de Errores* :
   - Captura cualquier problema en el proceso y devuelve un mensaje al usuario si la consulta falla.

---

*Cómo Usarlo*
- *Para Obtener Información de un Usuario de Instagram* :
  - Comando: `.igstalk <nombre de usuario>`
  - Ejemplo: `.igstalk cristiano`

---

*Requisitos*
1. *Dependencias* :
   - Asegúrate de instalar `node-fetch` si aún no lo tienes:
     ```bash
     npm install node-fetch
     ```

2. *Conexión a Internet* :
   - La API necesita acceso a la web para procesar la consulta.

3. *API Key* :
   - Verifica que `https://delirius-apiofc.vercel.app/tools/igstalk` esté accesible y funcione correctamente.

---

Este código está listo para integrarse a tu bot y realizar búsquedas detalladas en Instagram. ¡Avísame si necesitas más personalización o mejoras! 🚀✨📸