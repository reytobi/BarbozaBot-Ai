
import { promises } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
import { xpRange } from '../lib/levelling.js';

let Styles = (text, style = 1) => {
    var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
    var yStr = Object.freeze({
        1: '🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉１２３４５６７８９０'
    });
    var replacer = [];
    xStr.map((v, i) => replacer.push({
        original: v,
        convert: yStr[style].split('')[i]
    }));
    var str = text.toLowerCase().split('');
    var output = [];
    str.map(v => {
        const find = replacer.find(x => x.original == v);
        find ? output.push(find.convert) : output.push(v);
    });
    return output.join('');
};

let tags = {
    'anime': '🌀 *𝐀𝐍𝐈𝐌𝐄* 🎐',
    'main': '❗ *𝐈𝐍𝐅𝐎* ❕',
    'search': '🔎 *𝐒𝐄𝐀𝐑𝐂𝐇* 🔍',
    'game': '🎮 *𝐆𝐀𝐌𝐄* 🕹️',
    'serbot': '⚙️ *𝐒𝐔𝐁 𝐁𝐎𝐓𝐒* 🤖',
    'rpg': '⚔️ *𝐑𝐏𝐆* 🏆',
    'rg': '📜 *𝐑𝐄𝐆𝐈𝐒𝐓𝐑𝐎* 🎟️',
    'sticker': '🖼 *𝐒𝐓𝐈𝐂𝐊𝐄𝐑* 🎭',
    'img': '📷 *𝐈𝐌𝐀𝐆𝐄* 🎇',
    'group': '👥 *𝐆𝐑𝐎𝐔𝐏𝐒* 📢',
    'premium': '💎 *𝐏𝐑𝐄𝐌𝐈𝐔𝐌* 👑',
    'downloader': '📥 *𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃* 🔽',
    'tools': '🔧 *𝐓𝐎𝐎𝐋𝐒* 🛠️',
    'fun': '🎭 *𝐅𝐔𝐍* 🎊',
    'owner': '👤 *𝐎𝐖𝐍𝐄𝐑* 🏆',
    'audio': '🎵 *𝐀𝐔𝐃𝐈𝐎* 🔊',
    'advanced': '🛠 *𝐀𝐃𝐕𝐀𝐍𝐂𝐄𝐃* 🏅',
    'frefire':  '🔥 *𝐅𝐑𝐄𝐄𝐅𝐈𝐑𝐄* 🎮',
};

const defaultMenu = {
    before: `
*📌 Bienvenido, %name 📌*

🤖 *BOT:* ©Bot-Barboza-Ai®
💎 *Modo:* Público
🛠 *Dispositivo:* Multi Device
⏳ *Activo por:* %muptime

👥 *Usuarios:* %totalreg

🚀 *𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒:*  
━━━━━━━━━━━━━━`.trimStart(),
    header: '🔹 *%category* 🔹',
    body: '💠 %cmd %islimit %isPremium\n',
    footer: '━━━━━━━━━━━━━━',
    after: '© Bot-Barboza-Ai®',
};

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
    try {
        let tag = `@${m.sender.split("@")[0]}`;
        let mode = global.opts["self"] ? "Privado" : "Público";
        let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {};
        let { exp, limit, level } = global.db.data.users[m.sender];
        let { min, xp, max } = xpRange(level, global.multiplier);
        let name = await conn.getName(m.sender);
        let time = new Date().toLocaleTimeString('es', { hour: 'numeric', minute: 'numeric' });
        let muptime = clockString(process.uptime() * 1000);
        let totalreg = Object.keys(global.db.data.users).length;
        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
            return {
                help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
                tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                prefix: 'customPrefix' in plugin,
                limit: plugin.limit,
                premium: plugin.premium,
            };
        });

        conn.menu = conn.menu || {};
        let before = conn.menu.before || defaultMenu.before;
        let header = conn.menu.header || defaultMenu.header;
        let body = conn.menu.body || defaultMenu.body;
        let footer = conn.menu.footer || defaultMenu.footer;
        let after = conn.menu.after || defaultMenu.after;

        let _text = [
            before,
            ...Object.keys(tags).map(tag => {
                return header.replace(/%category/g, tags[tag]) + '\n' + [
                    ...help.filter(menu => menu.tags.includes(tag)).map(menu => {
                        return menu.help.map(help => {return body.replace(/%cmd/g, menu.prefix ? help : _p + help)
                                .replace(/%islimit/g, menu.limit ? '⭐' : '')
                                .replace(/%isPremium/g, menu.premium ? '👑' : '')
                                .trim();
                        }).join('\n');
                    }),
                    footer
                ].join('\n');
            }),
            after
        ].join('\n');

        let text = typeof conn.menu == 'string' ? conn.menu : _text;
        text = text.replace(new RegExp(`%(${Object.keys({ name, totalreg, muptime }).join('|')})`, 'g'), (_, name) => '' + { name, totalreg, muptime }[name]);

        await conn.sendMessage(m.chat, { text }, { quoted: m });
    } catch (e) {
        conn.reply(m.chat, '❎ Error al generar el menú.', m);
    }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu', 'comandos', 'help'];

export default handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    return `${h}h ${m}m`;
}