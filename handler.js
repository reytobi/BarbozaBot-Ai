import { smsg } from './lib/simple.js'
import { format } from 'util' 
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate)
        return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return
    if (global.db.data == null)
        await global.loadDatabase()
    try {
        m = smsg(this, m) || m
        if (!m)
            return
        m.exp = 0
        m.limit = false
        try {
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object')
                global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.exp))
                    user.exp = 0
                if (!isNumber(user.limit))
                    user.limit = 10
                if (!('premium' in user)) 
                    user.premium = false
                if (!user.premium) 
                    user.premiumTime = 0
                if (!('registered' in user))
                    user.registered = false
                if (!user.registered) {
                    if (!('name' in user))
                        user.name = m.name
                    if (!isNumber(user.age))
                        user.age = -1
                    if (!isNumber(user.regTime))
                        user.regTime = -1
                }
                if (!isNumber(user.afk))
                    user.afk = -1
                if (!('afkReason' in user))
                    user.afkReason = ''
                if (!('banned' in user))
                    user.banned = false
                if (!('useDocument' in user))
                    user.useDocument = false
                if (!isNumber(user.level))
                    user.level = 0
                if (!isNumber(user.bank))
                    user.bank = 0
            } else { // Inicializa el usuario si no existe
                global.db.data.users[m.sender] = {
                    exp: 0,
                    limit: 10,
                    premium: false, // Asegúrate de inicializar premium aquí también
                    premiumTime: 0,
                    registered: false,
                    name: m.name,
                    age: -1,
                    regTime: -1,
                    afk: -1,
                    afkReason: '',
                    banned: false,
                    useDocument: true,
                    bank: 0,
                    level: 0,
                }
                // Actualiza la variable 'user' después de la inicialización para asegurar que siempre esté definida.
                user = global.db.data.users[m.sender] 
            }

            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object')
                global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!('isBanned' in chat))
                    chat.isBanned = false
                if (!('bienvenida' in chat))
                    chat.bienvenida = false 
                if (!('antiLink' in chat))
                    chat.antiLink = false
                if (!('detect' in chat)) 
                    chat.detect = true
                if (!('onlyLatinos' in chat))
                    chat.onlyLatinos = false
                if (!('audios' in chat))
                    chat.audios = false
                if (!('modoadmin' in chat))
                    chat.modoadmin = false
                if (!('nsfw' in chat))
                    chat.nsfw = false
                if (!isNumber(chat.expired))
                    chat.expired = 0
                if (!('antiLag' in chat))
                    chat.antiLag = false
                if (!('per' in chat))
                    chat.per = []
            } else { // Inicializa el chat si no existe
                global.db.data.chats[m.chat] = {
                    isBanned: false,
                    bienvenida: false,
                    antiLink: false,
                    detect: true,
                    onlyLatinos: false,
                    nsfw: false,
                    audios: false,
                    modoadmin: false, 
                    expired: 0, 
                    antiLag: false,
                    per: [],
                }
                 // Actualiza la variable 'chat' después de la inicialización
                chat = global.db.data.chats[m.chat]
            }

            var settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('autoread' in settings)) settings.autoread = false
                if (!('antiPrivate' in settings)) settings.antiPrivate = false
                if (!('antiBot2' in settings)) settings.antiBot2 = false
                if (!('antiSpam' in settings)) settings.antiSpam = false
            } else global.db.data.settings[this.user.jid] = {
                self: false,
                autoread: false,
                antiPrivate: true,
                antiBot2: true,
                antiSpam: true,
                status: 0
            }
        } catch (e) {
            console.error(e)
        }
        
       // Tesis estuvo aquí 🤤
       // Asegurarse de que _user esté definido antes de usarlo
       const _user = global.db.data && global.db.data.users && global.db.data.users[m.sender] || {}
       const mainBot = global.conn.user.jid
       const chatData = global.db.data.chats[m.chat] || {} // Usar un nombre diferente para evitar conflicto con la variable 'chat' anterior.
       const isSubbs = chatData.antiLag === true
       const allowedBots = chatData.per || []
       if (!allowedBots.includes(mainBot)) allowedBots.push(mainBot)
       const isAllowed = allowedBots.includes(this.user.jid)
       if (isSubbs && !isAllowed) 
            return
        // --
        if (opts['nyimak'])  return
        if (!m.fromMe && opts['self'])  return
        if (opts['swonly'] && m.chat !== 'status@broadcast')  return
        if (typeof m.text !== 'string')
            m.text = ''

        const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isOwner = isROwner || m.fromMe
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        
        // Corrección de la línea isPrems para evitar 'undefined reading'
        const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || (_user && _user.premium === true)

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        if (m.isBaileys)
            return
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix

        const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {}
        const bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) == this.user.jid) : {}) || {}
        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin == 'admin' || false
        const isBotAdmin = bot?.admin || false

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    console.error(e)
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? 
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
// Tesis estuvo aquí 🙀
                let text = _args.join` `  
command = (command || '').toLowerCase()  
const groupLimitado = '120363418071387498@g.us'  
const comandosPermitidos = ['serbot', 'bots', 'kick', 'code', 's', 'n', 'grupo abrir', 'grupo cerrar', 'update', 'delsession', 'on', 'off', 'eval', 'e'];  

if (m.chat === groupLimitado && !comandosPermitidos.includes(command)) {
            return
}

                let fail = plugin.fail || global.dfail
                let isAccept = plugin.command instanceof RegExp ? 
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ?
                        plugin.command.some(cmd => cmd instanceof RegExp ? 
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? 
                            plugin.command === command :
                            false

                if (!isAccept)
                    continue
                m.plugin = name
                // Asegurarse de que 'chat' y 'user' estén definidos y sean objetos antes de acceder a sus propiedades
                const currentChat = global.db.data.chats[m.chat] || {};
                const currentUser = global.db.data.users[m.sender] || {};
                const currentSetting = global.db.data.settings[this.user.jid] || {};

                if (name != 'group-unbanchat.js' && currentChat?.isBanned)
                    return 
                if (name != 'owner-unbanuser.js' && currentUser?.banned)
                    return
                if (name != 'owner-unbanbot.js' && currentSetting?.banned)
                    return
                
                let adminMode = currentChat.modoadmin; // Usar currentChat aquí
                if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin) return
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { 
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { 
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { 
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { 
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { 
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { 
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { 
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { 
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) {
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && currentUser.registered == false) { // Usar currentUser aquí
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 
                if (xp > 200)
                    m.reply('chirrido -_-')
                else
                    m.exp += xp
                if (!isPrems && plugin.limit && currentUser.limit < plugin.limit * 1) { // Usar currentUser aquí
                    conn.reply(m.chat, `Se agotaron tus *✳️ Eris*`, m, rcanal)
                    continue
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems)
                        m.limit = m.limit || plugin.limit || false
                } catch (e) {
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        m.reply(text)
                    }
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.limit)
                        conn.reply(m.chat, `Utilizaste *${+m.limit}* ✳️`, m, rcanal)
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.limit -= m.limit * 1
            }

            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
      if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
    } catch (e) {
      console.log(m, m.quoted, e)
    }
    const settingsREAD = global.db.data.settings[this.user.jid] || {}
    if (opts['autoread']) await this.readMessages([m.key])
    if (settingsREAD.autoread) await this.readMessages([m.key])
  }
}

global.dfail = (type, m, conn, usedPrefix) => {
    let msg = {
        rowner: "❌🚫`𝗣𝗲𝗿𝗱𝗼𝗻, 𝗲𝘀𝘁𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼 𝗲𝘀 𝘀𝗼𝗹𝗼 𝗽𝗮𝗿𝗮 𝗺𝗶 𝗢𝘄𝗻𝗲𝗿`🚫❌",
        owner: " _*`🛑 𝗣𝗲𝗿𝗱𝗼𝗻, 𝘀𝗼𝗹𝗼 𝗺𝗶 𝗰𝗿𝗲𝗮𝗱𝗼𝗿 𝗽𝘂𝗲𝗱𝗲 𝘂𝘀𝗮𝗿 𝗲𝘀𝘁𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼⚡.`*_",
        mods: " _*`⚡ 𝗣𝗲𝗿𝗱𝗼𝗻, 𝗲𝘀𝘁𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼 𝘀𝗼𝗹𝗼 𝗲𝘀 𝗽𝗮𝗿𝗮 𝗺𝗼𝗱𝘀⚡`*_",
        premium: " _*`🔑 𝗡𝗼 𝗲𝗿𝗲𝘀 𝘂𝗻 𝘂𝘀𝘂𝗮𝗿𝗶𝗼 𝗣𝗥𝗘𝗠𝗜𝗨𝗠, 𝗵𝗮𝗯𝗹𝗮 𝗰𝗼𝗻 𝗺𝗶 𝗢𝘄𝗻𝗲𝗿⚡`*_",
        group: " _*`🟢 𝗣𝗲𝗿𝗱𝗼𝗻, 𝗲𝘀𝘁𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼 𝘀𝗼𝗹𝗼 𝗲𝘀 𝗽𝗮𝗿𝗮 𝗴𝗿𝘂𝗽𝗼𝘀⚡`*_",
        private: " _*`💬 𝗩𝗲 𝗮 𝗺𝗶 𝗰𝗵𝗮𝘁 𝗽𝗿𝗶𝘃𝗮𝗱𝗼 𝘆 𝘂𝘀𝗮 𝗲𝘀𝘁𝗲 𝗰𝗼𝗺𝗮𝗻𝗱𝗼⚡`*_",
        admin: " _*`❌ 𝗤𝘂𝗶𝗲𝗻 𝗲𝗿𝗲𝘀? 𝗧𝘂 𝗡𝗢 𝗲𝗿𝗲𝘀 𝗮𝗱𝗺𝗶𝗻⚡`*_",
        botAdmin: " _*`⚠️ 𝗘𝘀 𝗻𝗲𝗰𝗲𝘀𝗮𝗿𝗶𝗼 𝗤𝘂𝗲 𝗦𝗲𝗮 𝗮𝗱𝗺𝗶𝗻 𝗣𝗥𝗜𝗠𝗘𝗥𝗢 𝗣𝗔𝗥𝗔 𝘂𝘀𝗮𝗿 𝗲𝘀𝘁𝗮 𝗳𝘂𝗻𝗰𝗶𝗼́𝗻⚡`*_",
        unreg: " _*`‼️ 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 𝗡𝗢 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗔𝗗𝗢 ‼️`*_\n\n`𝗣𝗮𝗿𝗮 𝗥𝗲𝗴𝗶𝘀𝘁𝗿𝗮𝗿𝘀𝗲:`\n\n> .reg 𝗻𝗼𝗺𝗯𝗿𝗲.𝗲𝗱𝗮𝗱\n\n`𝗘𝗷𝗲𝗺𝗽𝗹𝗼:`\n\n> .reg Barboza.20",
        restrict: "*🚫 𝗖𝗼𝗺𝗮𝗻𝗱𝗼 𝗱𝗲𝘀𝗮𝗰𝘁𝗶𝘃𝗮𝗱𝗼 𝗽𝗼𝗿 𝗺𝗶 𝗢𝘄𝗻𝗲𝗿 🚫*" 
    }[type]
    if (msg) return  conn.reply(m.chat, msg, m, rcanal).then(_ => m.react('✖️'))
}

let file = global.__filename(import.meta.url, true)
watchFile(file, asy