
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

    // Variables de configuración del bot
    const botName = "Barboza Bot";
    const textBot = "Barboza AI";
    const canal = "Canal Oficial"; // Personalizable según tus necesidades

    const user = `@${m.messageStubParameters[0].split("@")[0]}`; // Usuario afectado

    // Bienvenida: StubType == 27 (GROUP_PARTICIPANT_ADD)
    if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      const welcomeText = chat.sWelcome
        ? chat.sWelcome
            .replace(/@user/g, user)
            .replace(/@group/g, groupMetadata.subject)
            .replace(/@desc/g, groupMetadata.desc || "sin descripción")
        : `┌─★ _${botName}_ \n│「 _Bienvenido_ 」\n└┬★ 「 ${user} 」\n   │✑ _Bienvenido_ a\n   │✑ ${groupMetadata.subject}\n   │✑ _Descripción_:\n${groupMetadata.desc || "_sin descripción_"}\n   └───────────────┈ ⳹`;

      await conn.sendMessage(m.chat, { text: welcomeText, mentions: [m.messageStubParameters[0]] });
    }

    // Despedida: StubType == 28 (GROUP_PARTICIPANT_REMOVE)
    if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
      const goodbyeText = chat.sBye
        ? chat.sBye
            .replace(/@user/g, user)
            .replace(/@group/g, groupMetadata.subject)
            .replace(/@desc/g, groupMetadata.desc || "sin descripción")
        : `┌─★ _${botName}_  \n│「 _Adiós_ 👋 」\n└┬★ 「 ${user} 」\n   │✑ _Suerte en tu camino_\n   │✑ _Gracias por haber sido parte del grupo_\n   └───────────────┈ ⳹`;

      await conn.sendMessage(m.chat, { text: goodbyeText, mentions: [m.messageStubParameters[0]] });
    }

    // Expulsión: StubType == 32 (GROUP_PARTICIPANT_LEAVE)
    if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      const kickText = chat.sBye
        ? chat.sBye
            .replace(/@user/g, user)
            .replace(/@group/g, groupMetadata.subject)
            .replace(/@desc/g, groupMetadata.desc || "sin descripción")
        : `┌─★ _${botName}_  \n│「 _Expulsado_ 👋 」\n└┬★ 「 ${user} 」\n   │✑ _Esperamos que encuentres otro grupo mejor_\n   │✑ _Que tengas suerte_\n   └───────────────┈ ⳹`;

      await conn.sendMessage(m.chat, { text: kickText, mentions: [m.messageStubParameters[0]] });
    }
  } catch (error) {
    console.error("❌ Error en el manejo de bienvenida/despedida:", error);
  }
}