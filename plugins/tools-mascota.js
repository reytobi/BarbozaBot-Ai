import fs from 'fs';

const filePath = './mineria.json';

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

// Función para leer datos del JSON
const leerDatos = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
    }
    return JSON.parse(fs.readFileSync(filePath));
};

// Función para guardar datos en el JSON
const guardarDatos = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Función para calcular el tiempo restante en formato de horas y minutos
const calcularTiempoRestante = (tiempoRestante) => {
    let horas = Math.floor(tiempoRestante / 3600000); // Dividir por 3600000 para obtener horas
    let minutos = Math.floor((tiempoRestante % 3600000) / 60000); // Dividir por 60000 para obtener minutos
    return `${horas} horas y ${minutos} minutos`;
};

let handler = async (m, { command, args, usedPrefix }) => {
    let usuarios = leerDatos();
    let usuario = usuarios[m.sender] || { dulces: 100, mascota: null, comida: 0, tiempoUltimaComida: 0 };

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
            let cantidadComida = parseInt(args[0]);
            if (!usuario.mascota) return m.reply("❌ No tienes una mascota. Usa *${usedPrefix}mimascota* para adoptar una.");
            if (!cantidadComida || cantidadComida <= 0) return m.reply("❌ Ingresa una cantidad válida.");
            if (usuario.comida < cantidadComida) return m.reply("❌ No tienes suficiente comida.");

            usuario.comida -= cantidadComida;
            usuario.tiempoUltimaComida = Date.now();
            usuarios[m.sender] = usuario;
            guardarDatos(usuarios);

            return m.reply(`🐾 Has alimentado a *${usuario.mascota}* con ${cantidadComida} comida. ¡Está más feliz!`);

        case 'mascota':
            if (!usuario.mascota) return m.reply("❌ No tienes una mascota.");

            let ahora = Date.now();
            let tiempoRestante = ahora - usuario.tiempoUltimaComida;
            let tiempoSinComer = ((ahora - usuario.tiempoUltimaComida) / 3600000).toFixed(1); // En horas

            let estadoMascota = "😊 Feliz";
            let tiempoFaltante = 8 - (tiempoSinComer % 8); // Para ver cuántas horas faltan para alimentarla nuevamente

            if (tiempoSinComer >= 8) {
                estadoMascota = "😢 Hambrienta";
            }

            // Calcular el tiempo restante para la próxima alimentación (en milisegundos)
            let tiempoRestanteParaAlimentar = 8 * 3600000 - tiempoRestante; // 8 horas en milisegundos
            let tiempoRestanteStr = calcularTiempoRestante(tiempoRestanteParaAlimentar);

            return m.reply(
                `🐾 *Estado de ${usuario.mascota}:*\n` +
                `🍖 Comida restante: ${usuario.comida || 0}\n` +
                `⏳ Última comida hace: ${tiempoSinComer} horas\n` +
                `💖 Estado: ${estadoMascota}\n` +
                `⏰ Recibirás un aviso en ${tiempoFaltante} horas para alimentarla.\n` +
                `⏳ *Debes esperar* ${tiempoRestanteStr} para alimentar nuevamente a tu mascota.`
            );

        default:
            return m.reply("❌ Comando no reconocido.");
    }
};

handler.command = /^(mimascota|comprar|costos|comprarcomida|alimentar|mascota)$/i;
export default handler;