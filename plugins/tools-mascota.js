import fs from 'fs';

const filePath = './mineria.json';
const FEEDING_COOLDOWN = 8 * 3600000; // 8 horas en milisegundos

let mascotas = {
    "🐶 Perro": { precio: 50, felicidad: 10 },
    "🐱 Gato": { precio: 40, felicidad: 8 },
    "🦅 Águila": { precio: 80, felicidad: 15 },
    "🐺 Lobo": { precio: 100, felicidad: 20 },
    "🐹 Hámster": { precio: 60, felicidad: 12 },
    "🐻 Oso": { precio: 120, felicidad: 25 },
    "🦊 Zorro": { precio: 90, felicidad: 18 },
    "🐉 Dragón": { precio: 200, felicidad: 50 },
    "🦄 Unicornio": { precio: 150, felicidad: 30 },
    "🐢 Tortuga": { precio: 70, felicidad: 10 },
    "🐍 Serpiente": { precio: 85, felicidad: 14 },
    "🐸 Rana": { precio: 45, felicidad: 6 },
    "🐘 Elefante": { precio: 130, felicidad: 28 },
    "🦁 León": { precio: 140, felicidad: 35 }
};

const leerDatos = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
    }
    return JSON.parse(fs.readFileSync(filePath));
};

const guardarDatos = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const calcularTiempoRestante = (tiempoRestante) => {
    if (tiempoRestante <= 0) return "0 horas y 0 minutos";
    
    let horas = Math.floor(tiempoRestante / 3600000);
    let minutos = Math.floor((tiempoRestante % 3600000) / 60000);
    return `${horas} horas y ${minutos} minutos`;
};

let handler = async (m, { command, args, usedPrefix }) => {
    let usuarios = leerDatos();
    let usuario = usuarios[m.sender] || { 
        dulces: 100, 
        mascota: null, 
        comida: 0, 
        tiempoUltimaComida: Date.now()
    };

    switch (command) {
        case 'mimascota':
            if (usuario.mascota) {
                return m.reply(`🐾 Ya tienes una mascota: *${usuario.mascota}*.\nUsa *${usedPrefix}mascota* para ver su estado.`);
            }
            let listaMascotas = Object.keys(mascotas).map(m => `${m} - ${mascotas[m].precio} 🍬`).join('\n');
            return m.reply(`🐾 *Mascotas disponibles:*\n${listaMascotas}\n\nUsa *${usedPrefix}comprar [nombre]* para adoptar una.`);

        case 'comprar':
            let nombreMascota = args.join(' ');
            if (!mascotas[nombreMascota]) return m.reply("❌ Mascota no encontrada. Usa *mimascota* para ver la lista.");
            if (usuario.dulces < mascotas[nombreMascota].precio) return m.reply("❌ No tienes suficientes 🍬 dulces.");

            usuario.dulces -= mascotas[nombreMascota].precio;
            usuario.mascota = nombreMascota;
            usuario.tiempoUltimaComida = Date.now(); // Inicializar tiempo al comprar
            usuarios[m.sender] = usuario;
            guardarDatos(usuarios);

            return m.reply(`🎉 ¡Has adoptado a ${nombreMascota}! Usa *${usedPrefix}mascota* para ver su estado.`);

        case 'costos':
            let costos = Object.keys(mascotas).map(m => `${m} - ${mascotas[m].precio} 🍬`).join('\n');
            return m.reply(`📜 *Lista de precios de mascotas:*\n${costos}`);

        case 'comprarcomida':
            let cantidad = parseInt(args[0]);
            if (!cantidad || cantidad <= 0) return m.reply("❌ Ingresa una cantidad válida.");
            let costoComida = cantidad * 5;
            if (usuario.dulces < costoComida) return m.reply("❌ No tienes suficientes 🍬 dulces.");

            usuario.dulces -= costoComida;
            usuario.comida += cantidad;
            usuarios[m.sender] = usuario;
            guardarDatos(usuarios);

            return m.reply(`🍖 Compraste ${cantidad} comida. Ahora tienes ${usuario.comida} comida.`);

        case 'alimentar':
            if (!usuario.mascota) return m.reply(`❌ No tienes una mascota. Usa *${usedPrefix}mimascota* para adoptar una.`);
            
            let cantidadComida = parseInt(args[0]);
            if (!cantidadComida || cantidadComida <= 0) return m.reply("❌ Ingresa una cantidad válida.");
            if (usuario.comida < cantidadComida) return m.reply("❌ No tienes suficiente comida.");

            let ahora = Date.now();
            let tiempoDesdeUltimaComida = ahora - (usuario.tiempoUltimaComida || ahora);
            
            if (tiempoDesdeUltimaComida < FEEDING_COOLDOWN) {
                let tiempoRestante = calcularTiempoRestante(FEEDING_COOLDOWN - tiempoDesdeUltimaComida);
                return m.reply(`❌ Debes esperar ${tiempoRestante} para volver a alimentar a tu mascota.`);
            }

            usuario.comida -= cantidadComida;
            usuario.tiempoUltimaComida = ahora;
            usuarios[m.sender] = usuario;
            guardarDatos(usuarios);

            // Calcular felicidad adicional basada en la cantidad de comida
            let felicidadBase = mascotas[usuario.mascota].felicidad;
            let felicidadAdicional = Math.floor(cantidadComida * (felicidadBase / 10));

            return m.reply(
                `🐾 Has alimentado a *${usuario.mascota}* con ${cantidadComida} comida.\n` +
                `💖 ¡Su felicidad aumentó en +${felicidadAdicional} puntos!`
            );

        case 'mascota':
            if (!usuario.mascota) return m.reply("❌ No tienes una mascota.");

            let tiempoActual = Date.now();
            let tiempoTranscurrido = tiempoActual - (usuario.tiempoUltimaComida || tiempoActual);
            let tiempoSinComer = Math.max(0, tiempoTranscurrido / 3600000); // En horas, mínimo 0

            let estadoMascota = "😊 Feliz";
            if (tiempoSinComer >= 8) {
                estadoMascota = "😢 Hambrienta";
            }

            // Calcular tiempo restante para próxima alimentación
            let tiempoRestanteParaAlimentar = Math.max(0, FEEDING_COOLDOWN - tiempoTranscurrido);
            let tiempoFaltante = Math.max(0, 8 - (tiempoSinComer % 8)); // Horas restantes para alimentar

            return m.reply(
                `🐾 *Estado de ${usuario.mascota}:*\n` +
                `🍖 Comida restante: ${usuario.comida || 0}\n` +
                `⏳ Última comida hace: ${tiempoSinComer.toFixed(1)} horas\n` +
                `💖 Estado: ${estadoMascota}\n` +
                `⏰ Recibirás un aviso en ${tiempoFaltante.toFixed(1)} horas para alimentarla.\n` +
                `⏳ *Debes esperar* ${calcularTiempoRestante(tiempoRestanteParaAlimentar)}`
            );

        default:
            return m.reply("❌ Comando no reconocido.");
    }
};

handler.command = /^(mimascota|comprar|costos|comprarcomida|alimentar|mascota)$/i;
export default handler;