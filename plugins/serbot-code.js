import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path';
import ws from 'ws';

let handler = async (m, { conn: _envio, command, usedPrefix, args, text, isOwner }) => {
  
  const conn = _envio;
  const jadi = 'jadibot';
  global.conns = global.conns || [];
  const botname = global.botname || "Bot";

  async function reportError(e) {
    await m.reply(`⚠️ Ocurrió un error.`);
    console.error(e);
  }

  const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command);
  const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command);
  const isCommand3 = /^(bots|sockets|socket)$/i.test(command);

  switch (true) {
    case isCommand1: {
      let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
      let uniqid = `${who.split('@')[0]}`;

      const sessionPath = `./${jadi}/${uniqid}`;

      if (!fs.existsSync(sessionPath)) {
        await conn.sendMessage(m.chat, { 
          text: `🍬 Usted no tiene una sesión, puede crear una usando:\n${usedPrefix + command}\n\nSi tiene una *(ID)* puede usar para saltarse el paso anterior usando:\n*${usedPrefix + command}* \`\`\`(ID)\`\`\`` 
        }, { quoted: m });
        return;
      }
      if (global.conn && global.conn.user.jid !== conn.user.jid) {
        return conn.sendMessage(m.chat, {
          text: `✎ Use este comando al *Bot* principal.\n\n*https://api.whatsapp.com/send/?phone=${global.conn.user.jid.split('@')[0]}&text=${usedPrefix + command}&type=phone_number&app_absent=0*`
        }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, { text: `✧ Tu sesión como *Sub-Bot* se ha eliminado` }, { quoted: m });
      }
      try {
        await fs.rmdir(sessionPath, { recursive: true, force: true });
        await conn.sendMessage(m.chat, { text: `✎ Ha cerrado sesión y borrado todo rastro.` }, { quoted: m });
      } catch (e) {
        reportError(e);
      }
      break;
    }
    case isCommand2: {
      if (global.conn && global.conn.user.jid === conn.user.jid) {
        conn.reply(m.chat, `✎ Si no es *Sub-Bot* comuníquese al número principal del *Bot* para ser *Sub-Bot*.`, m);
      } else {
        await conn.reply(m.chat, `✎ ${botname} desactivada.`, m);
        if (conn.ws && conn.ws.close) {
          conn.ws.close();
        }
      }
      break;
    }
    case isCommand3: {

      const users = [...new Set(global.conns.filter((c) => c.user && c.ws && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED))];
      function convertirMsADiasHorasMinutosSegundos(ms) {
        let segundos = Math.floor(ms / 1000);
        let minutos = Math.floor(segundos / 60);
        let horas = Math.floor(minutos / 60);
        let días = Math.floor(horas / 24);
        segundos %= 60;
        minutos %= 60;
        horas %= 24;
        let resultado = "";
        if (días !== 0) resultado += días + " días, ";
        if (horas !== 0) resultado += horas + " horas, ";
        if (minutos !== 0) resultado += minutos + " minutos, ";
        if (segundos !== 0) resultado += segundos + " segundos";
        return resultado;
      }
      const message = users.map((v, index) => `${index + 1}√
[🌸]+${v.user.jid.replace(/[^0-9]/g, '')}\n[💐] *Usuario*: ${v.user.name || 'Sub-Bot'}\n[🌻] *Online*: ${ v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : 'Desconocido'}`).join('\n\n\n\n');
      const replyMessage = message.length === 0 ? `No hay Sub-Bots disponibles por el momento, verifique más tarde.` : message;
      const totalUsers = users.length;
      const responseMessage = `*╔══❰ SUB-BOTS ACTIVOS ❱══╗* 

 ㅤത   ׅ     *𝚆ᧉ𝗅𝖼ᨣⴅᧉ*      🍁     ɱιʂ    ベ
ㅤ ೕ       ʂυႦ       ׄ   ꕑ        *Ⴆσƚ*
ㅤ ◞◟   ʂυႦႦσƚ    ✿•˖    🌴    ֵ   ᰨᰍ


* ꆬꆬ       ݂ʂυɱι Ⴆσƚ ::🌸

*
 ⏝⃨֟፝︶ .     ׅ    ꪆඏ᳞ᩙ୧    ׅ      .︶⃨֟፝⏝

> 🌸 Mis Sub-Bots Online: 
: ${totalUsers || '0'}
\n\n${replyMessage.trim()}`.trim();
      await conn.sendMessage(m.chat, { text: responseMessage, mentions: conn.parseMention(responseMessage) }, { quoted: m });
      break;
    }
  }
};

handler.tags = ['serbot'];
handler.help = ['sockets', 'deletesesion', 'pausarai'];
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesesaion', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket'];
export default handler;