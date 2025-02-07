let comidas = {
    "🥕 Zanahoria": { precio: 5, vida: 5 },
    "🍗 Pollo Asado": { precio: 15, vida: 15 },
    "🥩 Carne Roja": { precio: 25, vida: 25 },
    "🥛 Leche Mágica": { precio: 50, vida: 50 }
};

let handler = async (m, { args, command, usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    if (!user) return m.reply("❌ No estás registrado en el sistema.");
    
    switch (command) {
        case 'comida':
            let listaComida = Object.keys(comidas).map(c => `${c} - ${comidas[c].precio} 🍬`).join('\n');
            return m.reply(`🛒 *Tienda de Comida:*\n${listaComida}\n\nUsa *${usedPrefix}comprarcomida [nombre] [cantidad]* para comprar.`);

        case 'comprarcomida': {
            if (args.length < 2) return m.reply(`❌ Usa: *${usedPrefix}comprarcomida [nombre] [cantidad]*`);
            let [nombreComida, cantidad] = [args[0] + (args[1] ? " " + args[1] : ""), parseInt(args[2] || args[1])];

            if (!comidas[nombreComida]) return m.reply("❌ Comida no encontrada. Usa `.comida` para ver la lista.");
            if (isNaN(cantidad) || cantidad <= 0) return m.reply("❌ Ingresa una cantidad válida.");

            let costoTotal = comidas[nombreComida].precio * cantidad;
            if (user.dulces < costoTotal) return m.reply(`❌ No tienes suficientes 🍬 dulces. Tienes *${user.dulces}* dulces.`);

            user.dulces -= costoTotal;
            user.comida = user.comida || {};
            user.comida[nombreComida] = (user.comida[nombreComida] || 0) + cantidad;

            return m.reply(`✅ Compraste *${cantidad}* ${nombreComida}.\n💰 Gastaste: *${costoTotal}* 🍬\n📦 Ahora tienes: *${user.comida[nombreComida]}* ${nombreComida}.`);
        }

        case 'alimentar': {
            if (!user.mascota) return m.reply("❌ No tienes una mascota. Usa `.tienda` para comprar una.");
            if (!args[0]) return m.reply(`❌ Usa: *${usedPrefix}alimentar [nombre de comida]*`);

            let comidaSeleccionada = args.join(' ');
            if (!user.comida || !user.comida[comidaSeleccionada] || user.comida[comidaSeleccionada] <= 0) 
                return m.reply(`❌ No tienes ${comidaSeleccionada}. Compra en la tienda con *${usedPrefix}comprarcomida*.`);

            user.comida[comidaSeleccionada]--;
            user.mascota.vida += comidas[comidaSeleccionada].vida;

            return m.reply(`🐾 Alimentaste a *${user.mascota.nombre}* con ${comidaSeleccionada}.\n💛 Vida restaurada: *+${comidas[comidaSeleccionada].vida}*\n❤️ Vida actual: *${user.mascota.vida}*`);
        }
    }
};

handler.command = /^(comida|comprarcomida|alimentar)$/i;
export default handler;