import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
// import fetch from 'node-fetch' // 'node-fetch' está importado pero no se usa en este archivo. Si no lo necesitas, puedes quitarlo.

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate) return
    // Asegúrate de que 'this.pushMessage' esté correctamente definido en tu cliente Baileys.
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]

    if (!m) return

    // Verificar si la conexión del bot está activa
    if (!this.user || !this.user.jid) {
        console.error('Error: Bot no conectado o this.user.jid no definido')
        return
    }

    if (global.db.data == null) await global.loadDatabase()
    try {
        m = smsg(this, m) || m
        if (!m) return
        m.exp = 0
        m.limit = false
        try {
            // Inicializar usuario en la base de datos
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object') global.db.data.users[m.sender] = {}
            if (user) {
                if (!isNumber(user.exp)) user.exp = 0
                if (!isNumber(user.limit)) user.limit = 10
                if (!('premium' in user)) user.premium = false
                if (!user.premium) user.premiumTime = 0
                if (!('registered' in user)) user.registered = false
                if (!user.registered) {
                    if (!('name' in user)) user.name = m.name || ''
                    if (!isNumber(user.age)) user.age = -1
                    if (!isNumber(user.regTime)) user.regTime = -1
                }
                if (!isNumber(user.afk)) user.afk = -1
                if (!('afkReason' in user)) user.afkReason = ''
                if (!('banned' in user)) user.banned = false
                if (!('useDocument' in user)) user.useDocument = false
                if (!isNumber(user.level)) user.level = 0
                if (!isNumber(user.bank)) user.bank = 0
            } else {
                global.db.data.users[m.sender] = {
                    exp: 0,
                    limit: 10,
                    registered: false,
                    name: m.name || '',
                    age: -1,
                    regTime: -1,
                    afk: -1,
                    afkReason: '',
                    banned: false,
                    useDocument: true,
                    bank: 0,
                    level: 0,
                }
            }

            // Inicializar chat en la base de datos
            let chat = global.db.data.chats[m.chat] // Se usa 'chat' en el ámbito principal
            if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!('isBanned' in chat)) chat.isBanned = false
                if (!('bienvenida' in chat)) chat.bienvenida = false
                if (!('antiLink' in chat)) chat.antiLink = false
                if (!('detect' in chat)) chat.detect = true
                if (!('onlyLatinos' in chat)) chat.onlyLatinos = false
                if (!('audios' in chat)) chat.audios = false
                if (!('modoadmin' in chat)) chat.modoadmin = false
                if (!('nsfw' in chat)) chat.nsfw = false
                if (!isNumber(chat.expired)) chat.expired = 0
                if (!('antiLag' in chat)) chat.antiLag = false
                if (!('per' in chat)) chat.per = []
            } else {
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
            }

            // Inicializar configuración del bot
            const botJid = this.user.jid
            let settings = global.db.data.settings[botJid]

            if (typeof settings !== 'object') global.db.data.settings[botJid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('autoread' in settings)) settings.autoread = false
                if (!('antiPrivate' in settings)) settings.antiPrivate = false
                if (!('antiBot2' in settings)) settings.antiBot2 = false
                // CORRECCIÓN 1: Consistencia en la inicialización de antiSpam
                // Si en 'else' se inicializa a 'true', en 'if' también debería ser 'true' por defecto.
                if (!('antiSpam' in settings)) settings.antiSpam = true
                // CORRECCIÓN 2: Inicialización de 'banned'
                // 'settings.banned' se usa más adelante pero no se inicializa aquí.
                if (!('banned' in settings)) settings.banned = false
            } else {
                global.db.data.settings[botJid] = {
                    self: false,
                    autoread: false,
                    antiPrivate: true,
                    antiBot2: true,
                    antiSpam: true,
                    status: 0,
                    banned: false, // Agregado para inicializar 'banned'
                }
            }
        } catch (e) {
            console.error('Error al inicializar datos:', e)
        }

        // Asumo que 'opts' es una variable global, por ejemplo, global.opts.
        // Si 'opts' no está definido, el código fallará.
        // Ejemplo: const opts = global.opts || {};

        const mainBot = global.conn.user.jid
        // La variable 'chat' ya fue declarada en el ámbito superior. Reutilizamos esa.
        // const chat = global.db.data.chats[m.chat] || {} // ELIMINADA: Declaración redundante.
        const isSubbs = chat.antiLag === true
        const allowedBots = chat.per || []
        if (!allowedBots.includes(mainBot)) allowedBots.push(mainBot)
        const isAllowed = allowedBots.includes(this.user.jid)
        if (isSubbs && !isAllowed)
            return

        // Modos de operación
        if (opts['nyimak']) return
        if (!m.fromMe && opts['self']) return
        if (opts['swonly'] && m.chat !== 'status@broadcast') return
        if (typeof m.text !== 'string') m.text = ''

        let _user = global.db.data?.users?.[m.sender] || {}

        // Verificar roles
        const isROwner = [this.decodeJid(this.user.jid), ...global.owner.map(([number]) => number)]
            .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isOwner = isROwner || m.fromMe
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || _user.premium === true

        // Cola de mensajes para no premium
        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            // CORRECCIÓN 3: 'pipe' no es un método de array, debería ser 'push'.
            queque.push(m.id || m.key.id) // Corregido de 'pipe' a 'push'
            // NOTA: El manejo de la cola con setInterval para cada mensaje puede ser ineficiente.
            // Para un bot de alto tráfico, considera un sistema de cola más robusto (ej. procesar la cola en un bucle único).
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        if (m.isBaileys) return
        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
        const groupMetadata = (m.isGroup ? ((this.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const user = (m.isGroup ? participants.find(u => this.decodeJid(u.id) === m.sender) : {}) || {}
        const bot = (m.isGroup ? participants.find(u => this.decodeJid(u.id) === this.user.jid) : {}) || {}
        const isRAdmin = user?.admin === 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin === 'admin' || false
        const isBotAdmin = bot?.admin || false

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin || plugin.disabled) continue
            const __filename = join(___dirname, name)

            // Ejecutar plugin.all si existe
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    console.error(`Error en plugin.all (${name}):`, e)
                }
            }

            if (!opts['restrict'] && plugin.tags?.includes('admin')) continue

            // Procesar prefijo y comando
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix || this.prefix || global.prefix
            let match = (_prefix instanceof RegExp ?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? p : new RegExp(str2Regex(p))
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
                })) continue
            }

            if (typeof plugin !== 'function') continue
            if (!(usedPrefix = (match[0] || '')[0])) continue

            let noPrefix = m.text.replace(usedPrefix, '')
            let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
            args = args || []
            let _args = noPrefix.trim().split` `.slice(1)
            let text = _args.join` `
            command = (command || '').toLowerCase()

            // Restricción para grupo específico
            const gruposLimitados = ['120363418071387498@g.us', '120363400282268465@g.us'];
            const comandosPermitidos = ['serbot', 'bots', 'kick', 'code', 'delsession', 'tutosub', 'on', 'n'];

            if (gruposLimitados.includes(m.chat) && !comandosPermitidos.includes(command)) continue;
            let fail = plugin.fail || global.dfail
            let isAccept = plugin.command instanceof RegExp ?
                plugin.command.test(command) :
                Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command) :
                    typeof plugin.command === 'string' ?
                        plugin.command === command :
                        false

            if (!isAccept) continue
            m.plugin = name

            // Verificar bans
            // La variable 'chat' se refiere a la declarada al inicio de la función handler.
            // const chat = global.db.data.chats[m.chat] || {} // ELIMINADA: Declaración redundante
            const userData = global.db.data.users[m.sender] || {}
            const settings = global.db.data.settings[this.user.jid] || {}
            if
