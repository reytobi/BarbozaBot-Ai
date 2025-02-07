const mascotas = {
    "Perro": { emoji: "🐶", categoria: "Común", precio: 50, vida: 100, xp: 10, habilidad: "Lealtad (+5% XP en batallas)" },
    "Gato": { emoji: "🐱", categoria: "Común", precio: 60, vida: 90, xp: 12, habilidad: "Agilidad (+5% evasión en batalla)" },
    "Conejo": { emoji: "🐰", categoria: "Común", precio: 55, vida: 95, xp: 11, habilidad: "Velocidad (+10% ataque en primera ronda)" },
    
    "Zorro": { emoji: "🦊", categoria: "Rara", precio: 120, vida: 130, xp: 20, habilidad: "Sigilo (+10% probabilidad de esquivar ataques)" },
    "Lobo": { emoji: "🐺", categoria: "Rara", precio: 150, vida: 140, xp: 22, habilidad: "Liderazgo (+5% ataque por cada victoria)" },
    "Tortuga": { emoji: "🐢", categoria: "Rara", precio: 100, vida: 200, xp: 18, habilidad: "Defensa (+15% reducción de daño)" },

    "Águila": { emoji: "🦅", categoria: "Épica", precio: 250, vida: 160, xp: 30, habilidad: "Vista Aguda (+20% probabilidad de crítico)" },
    "Serpiente": { emoji: "🐍", categoria: "Épica", precio: 270, vida: 150, xp: 32, habilidad: "Veneno (Resta -5 de vida al enemigo por turno)" },
    "León": { emoji: "🦁", categoria: "Épica", precio: 300, vida: 180, xp: 35, habilidad: "Furia (+10% ataque cuando su vida está por debajo del 50%)" },

    "Dragón": { emoji: "🐉", categoria: "Legendaria", precio: 500, vida: 300, xp: 50, habilidad: "Llamarada (Inflige daño de fuego extra en batalla)" },
    "Unicornio": { emoji: "🦄", categoria: "Legendaria", precio: 450, vida: 280, xp: 48, habilidad: "Curación (Recupera 10% de vida cada turno)" },
    "Demonio": { emoji: "👹", categoria: "Legendaria", precio: 600, vida: 320, xp: 55, habilidad: "Caos (Ignora defensas enemigas)" }
};

let handler = async (m, { command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    if (!user) return m.reply("❌ No estás registrado en el sistema.");

    switch (command) {
        case 'tiendamascotas': {
            let lista = Object.keys(mascotas)
                .map(m => `${mascotas[m].emoji} *${m}* - ${mascotas[m].categoria}\n💛 Vida: ${mascotas[m].vida} | 🎖️ XP: ${mascotas[m].xp}\n🍬 Precio: ${mascotas[m].precio}\n🛠️ Habilidad: ${mascotas[m].habilidad}\n`)
                .join('\n──────────────────\n');
            
            return m.reply(`🐾 *Tienda de Mascotas*\n\n${lista}\n\nUsa *${usedPrefix}comprarmascota [nombre]* para comprar.`);
        }

        case 'comprarmascota': {
            let nombre = args.join(' ').trim();
            if (!mascotas[nombre]) return m.reply("❌ Mascota no encontrada. Usa *tiendamascotas* para ver la lista.");

            let mascotaSeleccionada = mascotas[nombre];

            if (user.dulces < mascotaSeleccionada.precio) return m.reply("❌ No tienes suficientes 🍬 dulces.");
            if (user.mascota) return m.reply("❌ Ya tienes una mascota. Usa *vendermascota* para cambiar.");

            user.dulces -= mascotaSeleccionada.precio;
            user.mascota = { 
                nombre, 
                emoji: mascotaSeleccionada.emoji, 
                vida: mascotaSeleccionada.vida, 
                xp: mascotaSeleccionada.xp, 
                habilidad: mascotaSeleccionada.habilidad 
            };

            return m.reply(`🎉 ¡Has comprado a ${mascotaSeleccionada.emoji} *${nombre}*! 🐾\n💛 Vida: ${mascotaSeleccionada.vida}\n🎖️ XP: ${mascotaSeleccionada.xp}\n🛠️ Habilidad: ${mascotaSeleccionada.habilidad}`);
        }
    }
};

handler.command = /^(tiendamascotas|comprarmascota)$/i;
export default handler;