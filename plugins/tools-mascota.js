const mascotas = {
    "🐶 Perro": { categoria: "Común", precio: 50, vida: 100, xp: 10, habilidad: "Lealtad (Gana +5% XP en batallas)" },
    "🐱 Gato": { categoria: "Común", precio: 60, vida: 90, xp: 12, habilidad: "Agilidad (+5% evasión en batalla)" },
    "🐰 Conejo": { categoria: "Común", precio: 55, vida: 95, xp: 11, habilidad: "Velocidad (+10% ataque en primera ronda)" },
    
    "🦊 Zorro": { categoria: "Rara", precio: 120, vida: 130, xp: 20, habilidad: "Sigilo (+10% probabilidad de esquivar ataques)" },
    "🐺 Lobo": { categoria: "Rara", precio: 150, vida: 140, xp: 22, habilidad: "Liderazgo (+5% ataque por cada victoria)" },
    "🐢 Tortuga": { categoria: "Rara", precio: 100, vida: 200, xp: 18, habilidad: "Defensa (+15% reducción de daño)" },

    "🦅 Águila": { categoria: "Épica", precio: 250, vida: 160, xp: 30, habilidad: "Vista Aguda (+20% probabilidad de crítico)" },
    "🐍 Serpiente": { categoria: "Épica", precio: 270, vida: 150, xp: 32, habilidad: "Veneno (Resta -5 de vida al enemigo por turno)" },
    "🦁 León": { categoria: "Épica", precio: 300, vida: 180, xp: 35, habilidad: "Furia (+10% ataque cuando su vida está por debajo del 50%)" },

    "🐉 Dragón": { categoria: "Legendaria", precio: 500, vida: 300, xp: 50, habilidad: "Llamarada (Inflige daño de fuego extra en batalla)" },
    "🦄 Unicornio": { categoria: "Legendaria", precio: 450, vida: 280, xp: 48, habilidad: "Curación (Recupera 10% de vida cada turno)" },
    "👹 Demonio": { categoria: "Legendaria", precio: 600, vida: 320, xp: 55, habilidad: "Caos (Ignora defensas enemigas)" }
};

let handler = async (m, { command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    if (!user) return m.reply("❌ No estás registrado en el sistema.");

    switch (command) {
        case 'tienda':
            let lista = Object.keys(mascotas)
                .map(m => `${m} - *${mascotas[m].categoria}*\n💛 Vida: ${mascotas[m].vida} | 🎖️ XP: ${mascotas[m].xp}\n🍬 Precio: ${mascotas[m].precio}\n🛠️ Habilidad: ${mascotas[m].habilidad}\n`)
                .join('\n──────────────────\n');
            return m.reply(`🐾 *Tienda de Mascotas*\n\n${lista}\n\nUsa *${usedPrefix}comprarmascota [nombre]* para comprar.`);

        case 'comprarmascota':
            let nombre = args.join(' ');
            if (!mascotas[nombre]) return m.reply("❌ Mascota no encontrada. Usa *tienda* para ver la lista.");

            if (user.dulces < mascotas[nombre].precio) return m.reply("❌ No tienes suficientes 🍬 dulces.");
            if (user.mascota) return m.reply("❌ Ya tienes una mascota. Usa *vendermascota* para cambiar.");

            user.dulces -= mascotas[nombre].precio;
            user.mascota = { nombre, vida: mascotas[nombre].vida, xp: mascotas[nombre].xp, habilidad: mascotas[nombre].habilidad };

            return m.reply(`🎉 ¡Has comprado a *${nombre}*! 🐾\n💛 Vida: ${mascotas[nombre].vida}\n🎖️ XP: ${mascotas[nombre].xp}\n🛠️ Habilidad: ${mascotas[nombre].habilidad}`);
    }
};

handler.command = /^(tienda|comprarmascota)$/i;
export default handler;