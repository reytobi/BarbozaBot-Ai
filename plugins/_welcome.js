
import { WAMessageStubType } from "@whiskeysockets/baileys";
import fetch from "node-fetch";

export async function before(m, { conn, participants, groupMetadata }) {
  try {
    // Verificar si el mensaje tiene StubType y si pertenece a un grupo
    if (!m.messageStubType || !m.isGroup) return true;

    // Obtener foto de perfil del usuario y manejar errores
    let ppUrl = await conn.profilePictureUrl(m.messageStubParameters[0], "image").catch(
      () => "https://qu.ax/Mvhfa.jpg" // URL de imagen predeterminada en caso de error
    );
    let img = await fetch(ppUrl).then(res => res.buffer()).catch(() => null); // Si falla el fetch, img será null

    // Validar que el grupo tiene configuraciones
    let chat = global.db?.data?.chats?.[m.chat];
    if (!chat) return true;

    let botname = "Barboza Bot"; // Nombre del bot
    let textbot = "Barboza AI"; // Texto identificador del bot
    let canal = "Canal Oficial"; // Nombre del canal de referencia (puedes personalizar esto)

    // Condición: Bienvenida (StubType == 27)
    if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let user = `@${m.messageStubParameters[0].split("@")[0]}`;
      let welcomeText = chat.sWelcome
        ? chat.sWelcome
            .replace(/@user/g, user)
            .replace(/@group/g, groupMetadata.subject)
            .replace(/@desc/g, groupMetadata.desc || "sin descripción")
        : `┌─★ _Barboza Bot_ \n│「 _Bienvenido_ 」\n└┬★ 「 ${user} 」\n   │✑  _Bienvenido_ a\n   │✑  ${groupMetadata.subject}\n   │✑  _Descripción_:\n${groupMetadata.desc || "_sin descripción_"}\n   └───────────────┈ ⳹`;

      await conn.sendAi(m.chat, botname, textbot, welcomeText, img, img, canal);
    }

    // Condición: Despedida (StubType == 28)
    if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
      let user = `@${m.messageStubParameters[0].split("@")[0]}`;
      let goodbyeText = chat.sBye
        ? chat.sBye
            .replace(/@user/g, user)
            .replace(/@group/g, groupMetadata.subject)
            .replace(/@desc/g, groupMetadata.desc || "sin descripción")
        : `┌─★ _Barboza Bot_  \n│「 _Adiós_ 👋 」\n└┬★ 「 ${user} 」\n   │✑  _Lamentamos tu salida_\n   │✑ _Suerte en tu camino_\n   └───────────────┈ ⳹`;

      await conn.sendAi(m.chat, botname, textbot, goodbyeText, img, img, canal);
    }

    // Condición: Expulsión (StubType == 32)
    if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      let user = `@${m.messageStubParameters[0].split("@")[0]}`;
      let kickText = chat.sBye
        ? chat.sBye
            .replace(/@user/g, user)
            .replace(/@group/g, groupMetadata.subject)
            .replace(/@desc/g, groupMetadata.desc || "sin descripción")
        : `┌─★ _Barboza Bot_  \n│「 _Expulsado_ 👋 」\n└┬★ 「 ${user} 」\n   │✑  _Lo sentimos, pero has sido eliminado_\n   │✑ _Esperamos que encuentres otro grupo mejor_\n   └───────────────┈ ⳹`;

      await conn.sendAi(m.chat, botname, textbot, kickText, img, img, canal);
    }
  } catch (error) {
    console.error("❌ Error en el manejo de bienvenida/despedida:", error);
  }
}