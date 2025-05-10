import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import fetch from 'node-fetch'
import { join } from 'path'
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let handler = async (m, { conn, args, usedPrefix, command, isPrems }) => {
  
  // RPG-Ultra V3 - Sistema de Juego de Rol Avanzado
  
  //━━━━━━━━━[ CONSTANTES GLOBALES ]━━━━━━━━━//
  
  const COOLDOWN_MINING = 5 * 60 * 1000 // 5 minutos
  const COOLDOWN_FARMING = 3 * 60 * 1000 // 3 minutos
  const COOLDOWN_HUNTING = 4 * 60 * 1000 // 4 minutos
  const COOLDOWN_ADVENTURE = 10 * 60 * 1000 // 10 minutos
  const COOLDOWN_DUEL = 30 * 60 * 1000 // 30 minutos
  const COOLDOWN_ROBBERY = 60 * 60 * 1000 // 1 hora
  const COOLDOWN_MARRIAGE = 24 * 60 * 60 * 1000 // 24 horas
  
  //━━━━━━━━━[ VERIFICACIÓN DE BASES DE DATOS ]━━━━━━━━━//
  
  // Asegúrese de que la base de datos de usuario exista
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = {
      // Datos básicos
      exp: 0, limit: 10, lastclaim: 0, registered: false, name: conn.getName(m.sender),
      // RPG - Recursos
      health: 100, stamina: 100, mana: 20, 
      gold: 50, diamond: 0, emerald: 0, ruby: 0, iron: 0, stone: 0, wood: 0, leather: 0, string: 0,
      herb: 0, food: 5, potion: 1, seeds: 0, crops: 0, 
      // RPG - Equipamiento
      weapon: 0, armor: 0, pickaxe: 0, axe: 0, fishingrod: 0,
      // RPG - Habilidades
      strength: 5, agility: 5, intelligence: 5, charisma: 5, vitality: 5,
      // RPG - Estadísticas
      level: 0, kills: 0, deaths: 0, wins: 0, losses: 0,
      // RPG - Social
      reputation: 0, guild: '', clan: '', family: '', marriage: '', children: [],
      // RPG - Propiedad
      house: 0, farm: 0, barn: 0, workshop: 0, shop: 0,
      // RPG - Temporizado
      lastadventure: 0, lastmining: 0, lastfarming: 0, lasthunting: 0, lastduel: 0, lastrobbery: 0, lastmarriage: 0,
      // RPG - Mascotas
      pet: 0, petExp: 0, petLevel: 0, petName: '',
    }
  }
  
  // Asegúrese de que la base de datos de grupos exista
  if (m.isGroup) {
    if (!global.db.data.groups) {
      global.db.data.groups = {}
    }
    if (!global.db.data.groups[m.chat]) {
      global.db.data.groups[m.chat] = {
        // Datos de grupo para RPG
        guild: '', territory: '', resources: {}, wars: 0, alliances: []
      }
    }
  }
  
  //━━━━━━━━━[ MENSAJES DE AYUDA ]━━━━━━━━━//
  
  const helpText = `
╔══════════════════════
║ 🌟 𝐑𝐏𝐆-𝐔𝐥𝐭𝐫𝐚 𝐕𝟑 🌟
╠══════════════════════
║ ⚔️ *COMANDOS DE ACCIÓN* ⚔️
║
║ ➤ ${usedPrefix}rpgprofile
║ ➤ ${usedPrefix}adventure
║ ➤ ${usedPrefix}mine
║ ➤ ${usedPrefix}hunt
║ ➤ ${usedPrefix}farm
║ ➤ ${usedPrefix}fish
║ ➤ ${usedPrefix}craft
║ ➤ ${usedPrefix}sell
║ ➤ ${usedPrefix}buy
║ ➤ ${usedPrefix}shop
║
╠══════════════════════
║ 🏆 *SISTEMA SOCIAL* 🏆
║
║ ➤ ${usedPrefix}duel @usuario
║ ➤ ${usedPrefix}rob @usuario
║ ➤ ${usedPrefix}marry @usuario
║ ➤ ${usedPrefix}divorce
║ ➤ ${usedPrefix}family
║ ➤ ${usedPrefix}adopt @usuario
║ ➤ ${usedPrefix}guild
║ ➤ ${usedPrefix}clan
║
╠══════════════════════
║ 🏠 *PROPIEDADES* 🏠
║
║ ➤ ${usedPrefix}buyhouse
║ ➤ ${usedPrefix}buyfarm
║ ➤ ${usedPrefix}workshop
║ ➤ ${usedPrefix}buildshop
║
╠══════════════════════
║ 🐶 *MASCOTAS* 🐱
║
║ ➤ ${usedPrefix}pet
║ ➤ ${usedPrefix}petadopt
║ ➤ ${usedPrefix}petfeed
║ ➤ ${usedPrefix}petstats
║ ➤ ${usedPrefix}petadventure
║
╠══════════════════════
║ 🌐 *MULTIJUGADOR* 🌐
║
║ ➤ ${usedPrefix}createclan
║ ➤ ${usedPrefix}joinclan
║ ➤ ${usedPrefix}leaveclan
║ ➤ ${usedPrefix}clanwar
║ ➤ ${usedPrefix}territory
║ ➤ ${usedPrefix}alliance
║ ➤ ${usedPrefix}love
║ ➤ ${usedPrefix}social
║
╠══════════════════════
║ 📜 *HISTORIA Y MISIONES* 📜
║
║ ➤ ${usedPrefix}quest
║ ➤ ${usedPrefix}daily
║ ➤ ${usedPrefix}weekly
║ ➤ ${usedPrefix}story
║ ➤ ${usedPrefix}dungeon
║
╚══════════════════════`
  
  //━━━━━━━━━[ PROCESAMIENTO DE COMANDOS ]━━━━━━━━━//
  
  let user = global.db.data.users[m.sender]
  let time = user.lastclaim + 86400000
  let _uptime = process.uptime() * 1000
  
  // Comando principal y su procesamiento
  if (!args[0]) {
    try {
      // Creación de la lista interactiva de comandos RPG
      const interactiveMessage = {
        header: { title: '🌟 𝐑𝐏𝐆-𝐔𝐥𝐭𝐫𝐚 𝐕𝟑 - 𝐒𝐢𝐬𝐭𝐞𝐦𝐚 𝐝𝐞 𝐉𝐮𝐞𝐠𝐨 🌟' },
        hasMediaAttachment: false,
        body: { text: `✨ 𝘽𝙞𝙚𝙣𝙫𝙚𝙣𝙞𝙙𝙤 𝙖𝙡 𝙈𝙪𝙣𝙙𝙤 𝙍𝙋𝙂 ✨
═══════════════════════
Selecciona una categoría de comandos para comenzar tu aventura:

➤ Usa: *.rpg [comando]*  
   Ejemplo: *.rpg adventure*, *.rpg mine*, *.rpg profile*

🎯 𝘾𝙖𝙩𝙚𝙜𝙤𝙧í𝙖𝙨 𝘿𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨:
  • 𝘼𝙫𝙚𝙣𝙩𝙪𝙧𝙖
  • 𝙍𝙚𝙘𝙤𝙡𝙚𝙘𝙘𝙞ó𝙣
  • 𝙋𝙚𝙧𝙛𝙞𝙡
  • 𝙏𝙞𝙚𝙣𝙙𝙖
  • 𝙈á𝙨...

⚡ ¡𝘼𝙙𝙚𝙡𝙖𝙣𝙩𝙚 𝘼𝙫𝙚𝙣𝙩𝙪𝙧𝙚𝙧𝙤! 𝙂𝙧𝙖𝙣𝙙𝙚𝙨 𝙧𝙚𝙩𝙤𝙨 𝙩𝙚 𝙖𝙜𝙪𝙖𝙧𝙙𝙖𝙣... ⚡` },
        nativeFlowMessage: {
          buttons: [
            {
              name: 'single_select',
              buttonParamsJson: JSON.stringify({
                title: '𝐒𝐞𝐥𝐞𝐜𝐜𝐢𝐨𝐧𝐚 𝐮𝐧𝐚 𝐜𝐚𝐭𝐞𝐠𝐨𝐫í𝐚',
                sections: [
                  {
                    title: '⚔️ COMANDOS DE ACCIÓN', 
                    highlight_label: "Popular",
                    rows: [
                      {
                        title: "│📊│PERFIL RPG", 
                        description: "Ver tu perfil con estadísticas, recursos y propiedades",
                        id: `${usedPrefix}rpg profile`
                      },
                      {
                        title: "│🏕️│AVENTURA", 
                        description: "Embárcate en una aventura para conseguir EXP y recursos",
                        id: `${usedPrefix}rpg adventure`
                      },
                      {
                        title: "│⛏️│MINAR", 
                        description: "Mina en busca de piedras preciosas y minerales",
                        id: `${usedPrefix}rpg mine`
                      },
                      {
                        title: "│🏹│CAZAR", 
                        description: "Caza animales para obtener comida y cuero",
                        id: `${usedPrefix}rpg hunt`
                      },
                      {
                        title: "│🌾│CULTIVAR", 
                        description: "Trabaja en tu granja para obtener cultivos y hierbas",
                        id: `${usedPrefix}rpg farm`
                      },
                      {
                        title: "│🎣│PESCAR", 
                        description: "Pesca una variedad de peces para alimento",
                        id: `${usedPrefix}rpg fish`
                      },
                      {
                        title: "│⚒️│FABRICAR", 
                        description: "Convierte recursos básicos en objetos valiosos",
                        id: `${usedPrefix}rpg craft`
                      }
                    ]
                  },
                  {
                    title: '🏆 SISTEMA SOCIAL', 
                    highlight_label: "Multijugador",
                    rows: [
                      {
                        title: "│⚔️│DUELO", 
                        description: "Desafía a otro jugador a un duelo de habilidades",
                        id: `${usedPrefix}rpg duel`
                      },
                      {
                        title: "│💰│ROBAR", 
                        description: "Intenta robar recursos de otro jugador",
                        id: `${usedPrefix}rpg rob`
                      },
                      {
                        title: "│💍│MATRIMONIO", 
                        description: "Propón matrimonio a otro jugador",
                        id: `${usedPrefix}rpg marry`
                      },
                      {
                        title: "│👨‍👩‍👧‍👦│FAMILIA", 
                        description: "Gestiona tu familia o adopta a otros jugadores",
                        id: `${usedPrefix}rpg family`
                      },
                      {
                        title: "│🛡️│CLAN", 
                        description: "Administra o únete a un clan de guerreros",
                        id: `${usedPrefix}rpg clan`
                      }
                    ]
                  },
                  {
                    title: '🏠 PROPIEDADES Y MASCOTAS', 
                    highlight_label: "Gestión",
                    rows: [
                      {
                        title: "│🏡│COMPRAR CASA", 
                        description: "Adquiere o mejora tu vivienda",
                        id: `${usedPrefix}rpg buyhouse`
                      },
                      {
                        title: "│🌱│COMPRAR GRANJA", 
                        description: "Adquiere o mejora tu granja para producir más cultivos",
                        id: `${usedPrefix}rpg buyfarm`
                      },
                      {
                        title: "│🔨│TALLER", 
                        description: "Construye un taller para mejorar el crafteo",
                        id: `${usedPrefix}rpg workshop`
                      },
                      {
                        title: "│🐶│MASCOTAS", 
                        description: "Gestiona tus mascotas que te ayudan en aventuras",
                        id: `${usedPrefix}rpg pet`
                      },
                      {
                        title: "│🦊│ADOPTAR MASCOTA", 
                        description: "Adopta una nueva mascota para tu aventura",
                        id: `${usedPrefix}rpg petadopt`
                      }
                    ]
                  },
                  {
                    title: '📜 MISIONES Y ECONOMÍA', 
                    highlight_label: "Diario",
                    rows: [
                      {
                        title: "│📋│MISIONES", 
                        description: "Acepta misiones para ganar recompensas especiales",
                        id: `${usedPrefix}rpg quest`
                      },
                      {
                        title: "│🌞│DIARIO", 
                        description: "Reclama tu recompensa diaria de recursos",
                        id: `${usedPrefix}rpg daily`
                      },
                      {
                        title: "│📖│HISTORIA", 
                        description: "Descubre la historia del mundo RPG",
                        id: `${usedPrefix}rpg story`
                      },
                      {
                        title: "│🏪│TIENDA", 
                        description: "Compra equipamiento, semillas y otros recursos",
                        id: `${usedPrefix}rpg shop`
                      },
                      {
                        title: "│☎️│CONTACTO", 
                        description: "Algun error? Algun Bug? Habla a Soporte para Tu Ayuda!!!",
                        id: `${usedPrefix}rpg soporte`
                      },
                      {
                        title: "│💱│VENDER", 
                        description: "Vende tus recursos para obtener oro",
                        id: `${usedPrefix}rpg sell`
                      }
                    ]
                  }
                ]
              })
            }
          ],
          messageParamsJson: ''
        }
      };

      const message = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: interactiveMessage
          }
        }
      }, {
        quoted: m
      });

      await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
      return;
    } catch (error) {
      console.error('Error al generar menu RPG:', error);
      return conn.reply(m.chat, helpText, m); // Fallback al texto de ayuda normal
    }
  }
  
  let type = (args[0] || '').toLowerCase()
  
  //━━━━━━━━━[ IMPLEMENTACIÓN DE COMANDOS ]━━━━━━━━━//
  
  switch(type) {
    // Perfil RPG del jugador
    case 'profile':
    case 'rpgprofile':
      let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => './src/avatar_contact.png')
      let expText = `
╔═══════════════════
║ 📊 𝐏𝐄𝐑𝐅𝐈𝐋 𝐃𝐄 𝐉𝐔𝐆𝐀𝐃𝐎𝐑 📊
╠═══════════════════
║ 👤 *Nombre:* ${user.name}
║ 🏅 *Nivel:* ${user.level}
║ ✨ *Experiencia:* ${user.exp}
║ ❤️ *Salud:* ${user.health}/100
║ ⚡ *Energía:* ${user.stamina}/100
║ 🔮 *Maná:* ${user.mana}/20
╠═══════════════════
║ 💰 *Oro:* ${user.gold}
║ 💎 *Diamantes:* ${user.diamond}
║ 🟢 *Esmeraldas:* ${user.emerald}
║ ❤️ *Rubíes:* ${user.ruby}
╠═══════════════════
║ ⚔️ *Fuerza:* ${user.strength}
║ 🏃 *Agilidad:* ${user.agility}
║ 🧠 *Inteligencia:* ${user.intelligence}
║ 🗣️ *Carisma:* ${user.charisma}
║ 💪 *Vitalidad:* ${user.vitality}
╠═══════════════════
║ 🏠 *Casa:* ${user.house ? 'Nivel ' + user.house : 'No tiene'}
║ 🌾 *Granja:* ${user.farm ? 'Nivel ' + user.farm : 'No tiene'}
║ 🏛️ *Gremio:* ${user.guild || 'No pertenece'}
║ 👨‍👩‍👧‍👦 *Familia:* ${user.family || 'No tiene'}
║ 💍 *Matrimonio:* ${user.marriage || 'Soltero/a'}
╠═══════════════════
║ 🐾 *Mascota:* ${user.pet ? user.petName + ' (Nivel ' + user.petLevel + ')' : 'No tiene'}
╚═══════════════════`
      conn.sendFile(m.chat, pp, 'profile.jpg', expText, m)
      break
    
    // Sistema de aventuras
    case 'adventure':
    case 'aventura':
      if (new Date - user.lastadventure < COOLDOWN_ADVENTURE) {
        let timeLeft = COOLDOWN_ADVENTURE - (new Date - user.lastadventure)
        return conn.reply(m.chat, `⏱️ Debes esperar ${Math.ceil(timeLeft / 60000)} minutos antes de otra aventura.`, m)
      }
      
      let rewards = {
        exp: Math.floor(Math.random() * 500) + 100,
        gold: Math.floor(Math.random() * 200) + 50,
        items: []
      }
      
      // Calcular probabilidades de encuentros
      let encounter = Math.random()
      let encounterText = ''
      
      if (encounter < 0.1) {
        // Encuentro peligroso - Dragon
        encounterText = `🐉 *¡Te has encontrado con un Dragón Ancestral!*\n\n`
        let success = (user.strength + user.agility + user.intelligence) > 30 || Math.random() < 0.3
        
        if (success) {
          encounterText += `Con gran valentía y estrategia, has logrado derrotar al Dragón. Entre sus tesoros encuentras:`
          rewards.exp += 1000
          rewards.gold += 800
          rewards.items.push('💎 5 Diamantes')
          rewards.items.push('❤️ 3 Rubíes')
          user.diamond += 5
          user.ruby += 3
        } else {
          encounterText += `El Dragón era demasiado fuerte. Has logrado escapar, pero con graves heridas.`
          user.health -= 50
          if (user.health < 0) user.health = 1
          rewards.exp = Math.floor(rewards.exp / 3)
          rewards.gold = Math.floor(rewards.gold / 4)
        }
      } else if (encounter < 0.3) {
        // Encuentro neutral - Mercader
        encounterText = `🧙‍♂️ *Te encuentras con un mercader místico*\n\n`
        encounterText += `Te ofrece un intercambio justo por tus habilidades. A cambio de ayudarlo a cruzar el bosque peligroso, te recompensa con:`
        rewards.exp += 200
        rewards.items.push('🧪 2 Pociones')
        user.potion += 2
      } else if (encounter < 0.6) {
        // Encuentro beneficioso - Cofre del tesoro
        encounterText = `🏆 *¡Has encontrado un antiguo cofre del tesoro!*\n\n`
        encounterText += `Al abrirlo descubres un botín espléndido:`
        rewards.gold += 300
        rewards.items.push('🟢 2 Esmeraldas')
        rewards.items.push('🧩 Fragmento de mapa')
        user.emerald += 2
      } else {
        // Encuentro común - Monstruos
        encounterText = `👾 *Te has adentrado en un nido de monstruos*\n\n`
        encounterText += `Después de una ardua batalla, logras salir victorioso. Recolectas:`
        rewards.items.push('🧶 5 Cuerdas')
        rewards.items.push('🧱 3 Piedras')
        rewards.items.push('🥩 2 Carnes')
        user.string += 5
        user.stone += 3
        user.food += 2
      }
      
      // Actualizar datos de usuario
      user.exp += rewards.exp
      user.gold += rewards.gold
      user.lastadventure = new Date
      
      // Construir mensaje de recompensa
      let rewardText = `
${encounterText}

*🎁 Recompensas obtenidas:*
✨ ${rewards.exp} EXP
💰 ${rewards.gold} Oro
${rewards.items.map(item => `• ${item}`).join('\n')}

❤️ Salud actual: ${user.health}/100
🔋 Energía: ${user.stamina - 20}/100`
      
      user.stamina -= 20
      if (user.stamina < 0) user.stamina = 0
      
      conn.reply(m.chat, rewardText, m)
      break
    
    // Sistema de minería
    case 'mine':
    case 'minar':
      if (new Date - user.lastmining < COOLDOWN_MINING) {
        let timeLeft = COOLDOWN_MINING - (new Date - user.lastmining)
        return conn.reply(m.chat, `⛏️ Tus herramientas aún se están enfriando. Espera ${Math.ceil(timeLeft / 60000)} minutos antes de volver a minar.`, m)
      }
      
      if (user.pickaxe < 1) {
        return conn.reply(m.chat, `🛠️ Necesitas un pico para minar. Compra uno en la tienda con ${usedPrefix}shop`, m)
      }
      
      if (user.stamina < 20) {
        return conn.reply(m.chat, `😫 Estás demasiado cansado para minar. Necesitas recuperar energía.`, m)
      }
      
      let miningSuccess = Math.random()
      let miningText = `⛏️ *Te adentras en las profundidades de la mina...*\n\n`
      let miningRewards = []
      
      // Calcular resultados de minería basados en la calidad del pico
      if (miningSuccess < 0.1) {
        // Hallazgo excepcional
        miningText += `💎 *¡VETA EXCEPCIONAL!* Has encontrado un filón rico en minerales preciosos.`
        let diamonds = Math.floor(Math.random() * 3) + 1
        let emeralds = Math.floor(Math.random() * 4) + 2
        let rubies = Math.floor(Math.random() * 2) + 1
        
        user.diamond += diamonds
        user.emerald += emeralds
        user.ruby += rubies
        user.exp += 450
        
        miningRewards.push(`💎 ${diamonds} Diamantes`)
        miningRewards.push(`🟢 ${emeralds} Esmeraldas`)
        miningRewards.push(`❤️ ${rubies} Rubíes`)
        miningRewards.push(`✨ 450 EXP`)
      } else if (miningSuccess < 0.4) {
        // Hallazgo bueno
        miningText += `⚒️ *¡Buen hallazgo!* Has encontrado una veta rica en minerales.`
        let iron = Math.floor(Math.random() * 8) + 5
        let stone = Math.floor(Math.random() * 15) + 10
        let gold_nuggets = Math.floor(Math.random() * 6) + 3
        
        user.iron += iron
        user.stone += stone
        user.gold += gold_nuggets
        user.exp += 200
        
        miningRewards.push(`⚙️ ${iron} Hierro`)
        miningRewards.push(`🧱 ${stone} Piedra`)
        miningRewards.push(`💰 ${gold_nuggets} Pepitas de oro`)
        miningRewards.push(`✨ 200 EXP`)
      } else {
        // Hallazgo común
        miningText += `🪨 Has encontrado algunos minerales comunes.`
        let stone = Math.floor(Math.random() * 10) + 5
        let iron = Math.floor(Math.random() * 5) + 1
        
        user.stone += stone
        user.iron += iron
        user.exp += 100
        
        miningRewards.push(`🧱 ${stone} Piedra`)
        miningRewards.push(`⚙️ ${iron} Hierro`)
        miningRewards.push(`✨ 100 EXP`)
      }
      
      // Probabilidad de desgaste del pico
      if (Math.random() < 0.2) {
        miningText += `\n\n🛠️ ¡Tu pico se ha desgastado un poco durante la minería!`
      }
      
      // Consumir energía
      user.stamina -= 20
      if (user.stamina < 0) user.stamina = 0
      
      user.lastmining = new Date
      
      let finalMiningText = `
${miningText}

*🎁 Recursos obtenidos:*
${miningRewards.map(item => `• ${item}`).join('\n')}

🔋 Energía restante: ${user.stamina}/100`
      
      conn.reply(m.chat, finalMiningTex