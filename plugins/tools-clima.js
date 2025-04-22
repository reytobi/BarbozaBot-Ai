
import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args[0]) {
            return m.reply(`❌ Debes proporcionar el nombre de una ciudad o país.\n\nEjemplo: *${usedPrefix + command} Tokio*`);
        }

        const location = encodeURIComponent(args.join(" "));
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=TU_API_KEY&units=metric&lang=es`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('❌ Error en la API.');

        const result = await response.json();
        if (!result.weather) throw new Error('❌ No se encontró información del clima.');

        const countryInfo = `🌍 *Información sobre ${result.sys.country}:*\n🗺️ *Ciudad:* ${result.name}\n🌡️ *Temperatura:* ${result.main.temp}°C\n☁️ *Clima:* ${result.weather[0].description}\n💨 *Viento:* ${result.wind.speed} km/h\n📈 *Humedad:* ${result.main.humidity}%`;

        await conn.sendMessage(m.chat, { text: countryInfo }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        m.reply(`❌ Ocurrió un error al obtener la información del clima.`);
    }
};

handler.command = /^clima$/i;
export default handler;
