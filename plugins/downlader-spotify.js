
import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("❌ Ingresa el nombre del artista o canción para buscar en Spotify.\nEjemplo: .spotify Twice");
  }

  try {
    // Llamada a la API para buscar canciones
    const searchApi = `https://delirius-apiofc.vercel.app/search/spotify?q=${encodeURIComponent(text)}&limit=20`;
    const searchResponse = await fetch(searchApi);
    const searchData = await searchResponse.json();

    if (!searchData?.data || searchData.data.length === 0) {
      return m.reply("❌ No se encontraron resultados para tu búsqueda. Intenta con otro nombre.");
    }

    // Mostrar los resultados disponibles al usuario
    let resultsMessage = "🎵 *Resultados de Spotify:*\n\n";
    searchData.data.forEach((track, index) => {
      resultsMessage += `${index + 1}. *${track.name}* - ${track.artists.map(a => a.name).join(", ")}\n🔗 *Enlace:* ${track.external_urls.spotify}\n\n`;
    });
    resultsMessage += "Responde con el número correspondiente para descargar una canción.";

    // Enviar resultados
    await conn.reply(m.chat, resultsMessage.trim(), m);

    // Recolectar respuesta del usuario
    conn.on("chat-update", async (chat) => {
      if (!chat.messages) return;
      let msg = chat.messages.all()[0];
      let content = msg.message?.conversation || "";

      if (/^\d+$/.test(content)) {
        let index = parseInt(content) - 1;
        if (index < 0 || index >= searchData.data.length) {
          return conn.reply(msg.key.remoteJid, "❌ Selección inválida. Intenta con un número válido.", msg);
        }

        // Obtener la URL del track seleccionado
        let track = searchData.data[index];
        const downloadApi = `https://api.vreden.my.id/api/spotify?url=${encodeURIComponent(track.external_urls.spotify)}`;
        const downloadResponse = await fetch(downloadApi);
        const downloadData = await downloadResponse.json();

        if (!downloadData?.result?.download_url) {
          return conn.reply(msg.key.remoteJid, "❌ No se pudo descargar la canción. Intenta con otra.", msg);
        }

        // Enviar canción al usuario
        await conn.sendMessage(msg.key.remoteJid, {
          audio: { url: downloadData.result.download_url },
          mimetype: "audio/mpeg",
          fileName: `${track.name}.mp3`,
        }, { quoted: msg });

        conn.reply(msg.key.remoteJid, `✅ *${track.name}* ha sido descargada exitosamente. ¡Disfrútala!`, msg);
      }
    });

  } catch (error) {
    console.error(error);
    m.reply(`❌ Ocurrió un error:\n${error.message}`);
  }
};

handler.command = ["spotify"];
handler.help = ["spotify <nombre>"];
handler.tags = ["downloader"];

export default handler;