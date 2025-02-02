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
        tiempoUltimaComida: Date.now() // Inicializamos con la hora actual
    };

    switch (command) {
        // ... otros casos permanecen igual ...

        case 'mascota':
            if (!usuario.mascota) return m.reply("❌ No tienes una mascota.");

            let ahora = Date.now();
            let tiempoTranscurrido = ahora - (usuario.tiempoUltimaComida || ahora);
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

        // ... resto del código ...
    }
};

handler.command = /^(mimascota|comprar|costos|comprarcomida|alimentar|mascota)$/i;
export default handler;