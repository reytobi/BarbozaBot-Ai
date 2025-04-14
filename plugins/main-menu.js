
import { promises } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
import { xpRange } from '../lib/levelling.js';

let tags = {
    'anime': '🌀 *𝐀𝐍𝐈𝐌𝐄* 🎐',
    'main': '❗ *𝐈𝐍𝐅𝐎* ❕',
    'search': '🔎 *𝐒𝐄𝐀𝐑𝐂𝐇* 🔍',
    'game': '🎮 *𝐆𝐀𝐌𝐄* 🕹️',
    'rpg': '⚔️ *𝐑𝐏𝐆* 🏆',
    'sticker': '🖼 *𝐒𝐓𝐈𝐂𝐊𝐄𝐑* 🎭',
    'img': '📷 *𝐈𝐌𝐀𝐆𝐄* 🎇',
    'group': '👥 *𝐆𝐑𝐎𝐔𝐏𝐒* 📢',
    'premium': '💎 *𝐏𝐑𝐄𝐌𝐈𝐔𝐌* 👑',
    'tools': '🔧 *𝐓𝐎𝐎𝐋𝐒* 🛠️',
    'fun': '🎭 *𝐅𝐔𝐍* 🎊',
    'owner': '👤 *𝐎𝐖𝐍𝐄𝐑* 🏆',
};

const defaultMenu = {
    before: `
🤖 *Bienvenido a Bot-Barboza-Ai* 🤖

💎 *Modo:* Público
⏳ *Activo por:* %muptime
👥 *Usuarios registrados:* %totalreg

🎮 *Comandos disponibles:*  
━━━━━━━━━━━━━━`.trimStart(),
    header: '🔹 *%category* 🔹',
    body: '💠 %cmd %islimit %isPremium\n',
    footer: '━━━━━━━━━━━━━━',
    after: '© Bot-Barboza-Ai®',
};

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
    try {
        let name = await conn.getName(m.sender);
        let muptime = clockString(process.uptime() * 1000);
        let totalreg = Object.keys(global.db.data.users).length;

        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
            return {
                help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
                tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
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

        let text = [
            before.replace(/%muptime/g, muptime).replace(/%totalreg/g, totalreg),
            ...Object.keys(tags).map(tag => {
                return header.replace(/%category/g, tags[tag]) + '\n' + [
                    ...help.filter(menu => menu.tags.includes(tag)).map(menu => {
                        return menu.help.map(cmd => {
                            return body.replace(/%cmd/g, _p + cmd)
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

        await conn.sendMessage(m.chat, { text }, { quoted: m });
    } catch (e) {
        conn.reply(m.chat, '❎ Error al generar el menú.', m);
        console.error(e);
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
