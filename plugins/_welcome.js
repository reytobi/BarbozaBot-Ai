
import { WAMessageStubType } from "@whiskeysockets/baileys";
import fetch from "node-fetch";

export async function before(m, { conn, participants, groupMetadata }) {
  try {
    if (!m.messageStubType || !m.isGroup) return true;

    let ppUrl = await conn.profilePictureUrl(m.messageStubParameters[0], "image").catch(
      () => "https://qu.ax/Mvhfa.jpg"
    );
    let imgBuffer = await fetch(ppUrl).then(res => res.buffer()).catch(() => null);

    let chat = global.db?.data?.chats?.[m.chat];
    if (!chat) return true;

    const botName = "🔥 Barboza Bot 🔥";
    const user = `@${m.messageStubParameters[0].split("@")[0]}`;
    const groupName = groupMetadata.subject;
    const groupDesc = groupMetadata.desc || "🌎 Sin descripción";

    // 🎉 Bienvenida
    if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      const welcomeText = chat.sWelcome
        ? chat.sWelcome.replace(/@user/g, user).replace(/@group/g, groupName).replace(/@desc/g, groupDesc)
        : `🎊 *¡Bienvenido, ${user}!* 🎊\n✨ *Has entrado a* ${groupName}.\n📢 *Descripción:* ${groupDesc}\n🚀 *Disfruta tu estancia y sigue las reglas!*`;

      await conn.sendMessage(m.chat, { 
        image: imgBuffer, 
        caption: welcomeText, 
        mentions: [m.messageStubParameters[0]] 
      });
    }

    // 👋 Despedida
    if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
      const goodbyeText = chat.sBye
        ? chat.sBye.replace(/@user/g, user).replace(/@group/g, groupName).replace(/@desc/g, groupDesc)
        : `👋 *¡Adiós, ${user}!*\n💡 *Gracias por ser parte de* ${groupName}.\n🌟 *Esperamos verte de nuevo!*`;

      await conn.sendMessage(m.chat, { 
        image: imgBuffer, 
        caption: goodbyeText, 
        mentions: [m.messageStubParameters[0]] 
      });
    }

    // ❌ Expulsión
    if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
      const kickText = chat.sBye
        ? chat.sBye.replace(/@user/g, user).replace(/@group/g, groupName).replace(/@desc/g, groupDesc)
        : `🚨 *¡Usuario Expulsado!* 🚨\n❌ *${user} ha sido eliminado de* ${groupName}.\n⚡ *Mejor suerte en otro grupo!*`;

      await conn.sendMessage(m.chat, { 
        image: imgBuffer, 
        caption: kickText, 
        mentions: [m.messageStubParameters[0]] 
      });
    }
  } catch (error) {
    console.error("❌ Error en bienvenida/despedida:", error);
  }
}