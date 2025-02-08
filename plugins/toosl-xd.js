export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
    let prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

    let setting = global.db.data.settings[this.user.jid]
    const settingsREAD = global.db.data.settings[this.user.jid] || {}

    // Marcar todos los mensajes como leídos
    await conn.readMessages([m.key])

    if (m.text && prefixRegex.test(m.text)) {      
        let usedPrefix = m.text.match(prefixRegex)[0]
        let command = m.text.slice(usedPrefix.length).trim().split(' ')[0]
    }

    if (m.fromMe) return !0
    if (m.isGroup) return !1
    if (!m.message) return !0
    if (m.chat === "120363336642332098@newsletter") return; 

    const regexWithPrefix = new RegExp(`^${prefixRegex.source}\\s?${comandos.source}`, 'i')
    if (regexWithPrefix.test(m.text.toLowerCase().trim())) return !0

    let chat, user, bot, mensaje
    chat = global.db.data.chats[m.chat]
    user = global.db.data.users[m.sender]
    bot = global.db.data.settings[this.user.jid] || {}

    if (bot.antiPrivate && !isOwner && !isROwner) {
        await conn.sendPresenceUpdate('composing', m.chat)
        await conn.reply(m.chat, mid.mAdvertencia + mid.smsprivado(m, cuentas), m, { mentions: [m.sender] })  
        await conn.updateBlockStatus(m.chat, 'block')
    }
    return !1
}