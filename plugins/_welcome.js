
import { WAMessageStubType} from "@whiskeysockets/baileys";
import fetch from "node-fetch";

export async function before(m, { conn, participants, groupMetadata}) {
  try {
    if (!m.messageStubType ||!m.isGroup) return true;

    let ppUrl = await conn.profilePictureUrl(m.messageStubParameters[0], "image").catch(
      () => "https://qu.ax/Mvhfa.jpg"
);
    let imgBuffer = await fetch(ppUrl).then(res => res.buffer()).catch(() => null);

    let chat = global.db?.data?.chats?.[m.chat];
    if (!chat) return true;

    const user = `@${m.messageStubParameters[0].split("@")[0]}`;
    const groupName = groupMetadata.subject;
    const groupDesc = groupMetadata.desc || "🌎 Sin descripción";
    const audioBienvenida = "https://qu.ax/RDuSG.mp3"; // Nuevo audio de bienvenida

    // 🎉 Bienvenida con audio
    if (chat.bienvenida && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      const welcomeText = `🎊 *¡Bienvenido, ${user}!* 🎊\n✨ *Has entrado a* ${groupName}.\n📢 *Descripción:* ${groupDesc}\n🚀 *Disfruta tu estancia y sigue las reglas!*`;

      await conn.sendMessage(m.chat, {
        image: imgBuffer,
        caption: welcomeText,
        mentions: [m.messageStubParameters[0]]
});

      await conn.sendFile(m.chat, audioBienvenida, "bienvenido.mp3", "", m);
}
} catch (error) {
    console.error("❌ Error en bienvenida:", error);
}
}