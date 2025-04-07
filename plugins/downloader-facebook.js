import fetch from 'node-fetch';

let MF = async(m, { conn, usedPrefix, command, args }) => {

if (!args[0]) return m.reply(`🌃 Por Favor Ingrese El Link Junto Al Comando\n> *Ejemplo:* ${usedPrefix + command} https://www.facebook.com/share/r/12BFZAtjpS8/?mibextid=qDwCgo`);

let fbDL = await facebookdl(args[0]);

let vid = fbDL.hd_url;

conn.sendMessage(m.chat, { video: { url: vid }, mimetype: 'video/mp4' }, { quoted: m });
}

MF.command = ['fb', 'facebook'];

export default MF;

async function facebookdl(url) {
let moon = await(await fetch(`https://vapis.my.id/api/fbdl?url=${url}`)).json();
return moon;
}