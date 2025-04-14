Import { promises } from ‘fs’
Import { join } from ‘path’
Import fetch from ‘node-fetch’
Import { xpRange } from ‘../lib/levelling.js’
Let Styles = (text, style = 1) => {
  Var xStr = ‘abcdefghijklmnopqrstuvwxyz1234567890’.split(‘’);
  Var yStr = Object.freeze({
    1: ‘ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890’
  });
  Var replacer = [];
  xStr.map((v, i) => replacer.push({
    original: v,
    convert: yStr[style].split(‘’)[i]
  }));
  Var str = text.toLowerCase().split(‘’);
  Var output = [];
  Str.map(v => {
    Const find = replacer.find(x => x.original == v);
    Find ¿ output.push(find.convert) : output.push(v);
  });
  Return output.join(‘’);
};
Let tags = {
  ‘anime’: ‘🧧 _ANIME_ 🎐’,
  ‘main’: ‘❗ _INFO_ ❕’,
  ‘search’: ‘🔎 _SEARCH_ 🔍’,
  ‘game’: ‘🕹️ GAME 🎮’,
  ‘serbot’: ‘⚙️ _SUB BOTS_ 🤖’,
  ‘rpg’: ‘🌐 _RPG_ 🥇’,
  ‘rg’: ‘🎑 _REGISTRO_ 🎟️’,
  ‘sticker’: ‘💟 2STICKER_ 🏷️’,
  ‘img’: ‘🖼️ _IMAGE_ 🎇’,
  ‘group’: ‘👥 _GROUPS_ 📢’,
//  ‘logo’: ‘_MAKER_’,
  ‘nable’: ‘🎛️ _ON / OFF_ 🔌’, 
  ‘premium’: ‘💎 _PREMIUM_ 👑’,
  ‘downloader’: ‘📥 _DOWNLOAD_ 📤’,
  ‘tools’: ‘🔧 _TOOLS_ 🛠️’,
  ‘fun’: ‘🎉 _FUN_ 🎊’,
  ‘nsfw’: ‘🔞 _NSFW_ 📛’, 
  ‘cmd’: ‘🧮 _DATABASE_ 🖥️’,
  ‘owner’: ‘👤 _OWNER_ 👁️’, 
  ‘audio’: ‘📣 _AUDIOS_ 🔊’, 
  ‘advanced’: ‘🗝️ _ADVANCED_ 📍’,
  ‘frefire’:  ‘🎮_frefire_ 🎮’,
}

Const defaultMenu = {
  Before:  `*─ׄ─ׅ─⭒─ׄ─ׄ─⭒─ׅ─ׄ─⭒─ׄ─ׄ─⭒─ׄ─ׄ─*
Hola *%name* soy *Barboza*



╔══════ •『 𝑪𝑹𝑬𝑨𝑫𝑶𝑹 』

║  🖥️ Barboza

╚═════ ♢.✰.♢ ══════

╔══════ •『 𝑰𝑵𝑭𝑶-𝑩𝑶𝑻 』

║  👤 Cliente: %name

║  ⭐ Exp: %exp

║  ⚡ Nivel: %level

╚═════ ♢.✰.♢ ═══════



╔══════ •『 𝑰𝑵𝑭𝑶-𝑼𝑺𝑬𝑹』

║  🤖 Bot: ©Bot-Barboza-Ai®

║  💎 Modo Público

║  💨 Baileys: Multi Device

║  🪄 Tiempo Activo: %muptime

║  🎩 Usuarios: %totalreg 

╚═════ ♢.✰.♢ ════════

*─ׄ─ׄ─⭒─ׄ─ׅ─ׄ⭒─ׄ─ׄ─⭒─ׄ─ׄ─⭒─ׄ─ׅ─*
 %readmore

\t\t\t⚙️_*𝐋𝐈𝐒𝐓𝐀 𝐃𝐄 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒*_ 🚀

`.trimStart(),
  Header: ‘*╭╍╍╍╍❖【 *%category* 】’,
  Body: ‘┋💸›【 %cmd %islimit %isPremium\n’,
  Footer: ‘*╰╍╍╍╍❖•ೋ° °ೋ•❖╍╍╍╍╯*’,
  After: `© ${textbot}`,

}

Let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  Try {
     Let tag = `@${m.sender.split(“@”)[0]}`
    Let mode = global.opts[“self”] ¿ “Privado” : “Publico”
    Let _package = JSON.parse(await promises.readFile(join(__dirname, ‘../package.json’)).catch(_ => ({}))) || {}
    Let { exp, limit, level } = global.db.data.users[m.sender]
    Let { min, xp, max } = xpRange(level, global.multiplier)
    Let name = await conn.getName(m.sender)
    Let d = new Date(new Date + 3600000)
    Let locale = ‘es’
    Let weton = [‘Pahing’, ‘Pon’, ‘Wage’, ‘Kliwon’, ‘Legi’][Math.floor(d / 84600000) % 5]
    Let week = d.toLocaleDateString(locale, { weekday: ‘long’ })
    Let date = d.toLocaleDateString(locale, {
      Day: ‘numeric’,
      Month: ‘long’,
      Year: ‘numeric’
    })
    Let dateIslamic = Intl.DateTimeFormat(locale + ‘-TN-u-ca-islamic’, {
      Day: ‘numeric’,
      Month: ‘long’,
      Year: ‘numeric’
    }).format(d)
    Let time = d.toLocaleTimeString(locale, {
      Hour: ‘numeric’,
      Minute: ‘numeric’,
      Second: ‘numeric’
    })
    Let _uptime = process.uptime() * 1000
    Let _muptime
    If (process.send) {
      Process.send(‘uptime’)
      _muptime = await new Promise(resolve => {
        Process.once(‘message’, resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    Let muptime = clockString(_muptime)
    Let uptime = clockString(_uptime)
    Let totalreg = Object.keys(global.db.data.users).length
    Let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    Let help = Object.values(global.plugins).filter(plugin => ¡plugin.disabled).map(plugin => {
      Return {
        Help: Array.isArray(plugin.tags) ¿ plugin.help : [plugin.help],
        Tags: Array.isArray(plugin.tags) ¿ plugin.tags : [plugin.tags],
        Prefix: ‘customPrefix’ in plugin,
        Limit: plugin.limit,
        Premium: plugin.premium,
        Enabled: ¡plugin.disabled,
      }
    })
    For (let plugin of help)
      If (plugin && ‘tags’ in plugin)
        For (let tag of plugin.tags)
          If (¡(tag in tags) && tag) tags[tag] = tag
    Conn.menu = conn.menu ¿ conn.menu : {}
    Let before = conn.menu.before || defaultMenu.before
    Let header = conn.menu.header || defaultMenu.header
    Let body = conn.menu.body || defaultMenu.body
    Let footer = conn.menu.footer || defaultMenu.footer
    Let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ¿ ‘’ : ``) + defaultMenu.after
    Let _text = [
      Before,
      …Object.keys(tags).map(tag => {
        Return header.replace(/%category/g, tags[tag]) + ‘\n’ + [
          …help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            Return menu.help.map(help => {
              Return body.replace(/%cmd/g, menu.prefix ¿ help : ‘%p’ + help)
                .replace(/%islimit/g, menu.limit ¿ ‘◜⭐◞’ : ‘’)
                .replace(/%isPremium/g, menu.premium ¿ ‘◜🪪◞’ : ‘’)
                .trim()
            }).join(‘\n’)
          }),
          Footer
        ].join(‘\n’)
      }),
      After
    ].join(‘\n’)
    Let text = typeof conn.menu == ‘string’ ¿ conn.menu : typeof conn.menu == ‘object’ ¿ _text : ‘’
   Let replace = {
 “%”: “%”,
 P: _p,
 Uptime,
 Muptime,
 Me: conn.getName(conn.user.jid),
 Npmname: _package.name,
 Npmdesc: _package.description,
 Version: _package.version,
 Exp: exp – min,
 Maxexp: xp,
 Totalexp: exp,
 Xp4levelup: max – exp,
 Github: _package.homepage ¿ _package.homepage.url || _package.homepage : “[unknown github url]”,
 Mode,
 _p,
 Tag,
 Name,
 Level,
 Limit,
 Name,
 Totalreg,
 Readmore: readMore
   }
    Text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length – a.length).join`|`})`, ‘g’), (_, name) => ‘’ + replace[name])

    Let pp = ‘https://i.ibb.co/CPVcnqH/file.jpg’
    Let pp2 = ‘https://i.ibb.co/9WrytGt/file.jpg’
    Let pp3 = ‘https://i.ibb.co/CPVcnqH/file.jpg’
    Let pp4 = ‘https://i.ibb.co/9WrytGt/file.jpg’
    Let pp5 = ‘https://i.ibb.co/CPVcnqH/file.jpg’
    Let pp6 = ‘https://i.ibb.co/9WrytGt/file.jpg’
    Let pp7 = ‘https://i.ibb.co/CPVcnqH/file.jpg’
    Let pp8 = ‘https://i.ibb.co/9WrytGt/file.jpg’
    Let pp9 = ‘https://i.ibb.co/JmcS3kv/Sylph.jpg’
    Let pp10 = ‘https://i.ibb.co/CPVcnqH/file.jpg’
    Let pp11 = ‘https://i.ibb.co/JmcS3kv/Sylph.jpg’
    Let pp12 = ‘https://i.ibb.co/CPVcnqH/file.jpg’
    Let pp13 = ‘https://i.ibb.co/Cs6Tt9V/Sylph.jpg’
    Let pp14 = ‘https://i.ibb.co/JmcS3kv/Sylph.jpg’
    Let pp15 = ‘https://i.ibb.co/Cs6Tt9V/Sylph.jpg’
    Let img = ‘https://qu.ax/Mvhfa.jpg’
    Let img2 = ‘https://d.uguu.se/iqqLBUfF.jpg’
    Await m.react(‘⭐’)
   // await conn.sendMessage(m.chat, { video: { url: [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8, pp9, pp10, pp11, pp12, pp13, pp14, pp15].getRandom() }, gifPlayback: true, caption: text.trim(), mentions: [m.sender] }, { quoted: estilo })
    Await conn.sendFile(m.chat, img, ‘thumbnail.jpg’, text.trim(), m, null, rcanal)
   //await conn.sendAi(m.chat, botname, textbot, text.trim(), img, img, canal, estilo)

  } catch € {
    Conn.reply(m.chat, ‘❎ Lo sentimos, el menú tiene un error.’, m)
    Throw e
  }
}

Handler.help = [‘allmenu’]
Handler.tags = [‘main’]
Handler.command = [‘allmenu’, ‘menucompleto’, ‘menúcompleto’, ‘menú’, ‘menu’] 
Handler.register = true 
Export default handler


Const more = String.fromCharCode(8206)
Const readMore = more.repeat(4001)

Function clockString(ms) {
  Let h = isNaN(ms) ¿ ‘—‘ : Math.floor(ms / 3600000)
  Let m = isNaN(ms) ¿ ‘—‘ : Math.floor(ms / 60000) % 60
  Let s = isNaN(ms) ¿ ‘—‘ : Math.floor(ms / 1000) % 60
  Return [h, m, s].map(v => v.toString().padStart(2, 0)).join(‘:’)
}

  Var ase = new Date();
  Var hour = ase.getHours();
Switch(hour){
  Case 0: hour = ‘una linda noche 🌙’; break;
  Case 1: hour = ‘una linda noche 💤’; break;
  Case 2: hour = ‘una linda noche 🦉’; break;
  Case 3: hour = ‘una linda mañana ✨’; break;
  Case 4: hour = ‘una linda mañana 💫’; break;
  Case 5: hour = ‘una linda mañana 🌅’; break;
  Case 6: hour = ‘una linda mañana 🌄’; break;
  Case 7: hour = ‘una linda mañana 🌅’; break;
  Case 8: hour = ‘una linda mañana 💫’; break;
  Case 9: hour = ‘una linda mañana ✨’; break;
  Case 10: hour = ‘un lindo dia 🌞’; break;
  Case 11: hour = ‘un lindo dia 🌨’; break;
  Case 12: hour = ‘un lindo dia ❄’; break;
  Case 13: hour = ‘un lindo dia 🌤’; break;
  Case 14: hour = ‘una linda tarde 🌇’; break;
  Case 15: hour = ‘una linda tarde 🥀’; break;
  Case 16: hour = ‘una linda tarde 🌹’; break;
  Case 17: hour = ‘una linda tarde 🌆’; break;
  Case 18: hour = ‘una linda noche 🌙’; break;
  Case 19: hour = ‘una linda noche 🌃’; break;
  Case 20: hour = ‘una linda noche 🌌’; break;
  Case 21: hour = ‘una linda noche 🌃’; break;
  Case 22: hour = ‘una linda noche 🌙’; break;
  Case 23: hour = ‘una linda noche 🌃’; break;
}
  Var greeting = “espero que tengas “ + hour;

