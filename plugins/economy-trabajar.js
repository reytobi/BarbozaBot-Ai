
import fs from 'fs';

const filePath = './mineria.json';
let cooldowns = {};

let handler = async (m, { conn, isPrems }) => {
    // Cargar datos de mineria.json
    let data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : {};

    let who = m.sender;
    let tiempo = 5 * 60; // 5 minutos de cooldown

    if (cooldowns[who] && Date.now() - cooldowns[who] < tiempo * 1000) {
        const tiempoRestante = segundosAHMS(Math.ceil((cooldowns[who] + tiempo * 1000 - Date.now()) / 1000));
        conn.reply(m.chat, `🤚 Espera ⏱️ *${tiempoRestante}* para volver a Trabajar.`, m);
        return;
    }

    // Generar recompensas aleatorias
    let xp = Math.floor(Math.random() * 5000);
    let barbozaCoins = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
    let diamantes = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
    let dulces = Math.floor(Math.random() * (50 - 10 + 1)) + 10; // Cambié de 'dulce' a 'dulces'

    // Si el usuario no está en el JSON, se inicializa
    if (!data[who]) {
        data[who] = { xp: 0, barbozaCoins: 0, diamantes: 0, dulces: 0 };
    }

    // Sumar recompensas al usuario
    data[who].xp += xp; // Cambié 'exp' a 'xp'
    data[who].barbozaCoins += barbozaCoins;
    data[who].diamantes += diamantes;
    data[who].dulces += dulces; // Cambié '${dulces}' a 'dulces'

    // Guardar datos actualizados en mineria.json
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    let mensaje = `👨‍🏭 *${pickRandom(trabajo)}*  
🎖 *Recompensas obtenidas:*  
▢ *${xp}* 💫 XP  
▢ *${barbozaCoins}* 🪙 Monedas  
▢ *${diamantes}* 💎 Diamantes  
▢ *${dulces}* 🍬 Dulces`; // Cambié '${dulce}' a '${dulces}'

    cooldowns[who] = Date.now();
    await conn.reply(m.chat, mensaje, m);
}

handler.help = ['trabajar'];
handler.tags = ['economy'];
handler.command = ['w', 'work', 'chambear', 'chamba', 'trabajar'];
handler.group = true;
handler.register = true;

export default handler;

function segundosAHMS(segundos) {
    let minutos = Math.floor((segundos % 3600) / 60);
    let segundosRestantes = segundos % 60;
    return `${minutos} minutos y ${segundosRestantes} segundos`; // Cambié ${minutos} por `${minutos}`
}

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())];
}

// Lista de trabajos
const trabajo = [
   "Trabajaste como cortador de galletas y ganaste",
   "Trabajaste en una empresa militar privada, ganando",
   "Organizaste un evento de cata de vinos y obtuviste",
   "Limpiaste una chimenea y encontraste",
   "Desarrollaste juegos y ganaste",
   "Trabajaste en la oficina horas extras por",
   "Trabajaste en un Pizza Hut local y ganaste",
   "Diseñaste un logo para una empresa y recibiste",
   "Vendiste sándwiches de pescado y obtuviste",
   "Trabajaste como actor de voz para Bob Esponja y ganaste",
   "Reparaste un tanque en Afganistán y la tripulación te pagó",
   "Trabajaste en Disneyland disfrazado de panda y ganaste",
   "Hiciste trabajos ocasionales y ganaste",
   "Limpiaste moho tóxico de la ventilación y recibiste",
   "Resolvió el misterio del brote de cólera y el gobierno te recompensó",
   "Trabajaste como ecologista de anguilas y ganaste",
   "Reparaste máquinas recreativas y recibiste",
   "Trabajaste como artista callejero y ganaste",
   "Hiciste trabajo social y recibiste una recompensa",
   "Fuiste agricultor y obtuviste",
   "Trabajaste como constructor de castillos de arena y ganaste"
];