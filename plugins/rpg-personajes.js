// Guardar cambios en el archivo
        fs.writeFileSync('./cartera.json', JSON.stringify(cartera, null, 2));

        // Textos aleatorios con emojis
        const textos = [
            `⚡ *${personaje.nombre} desató un ataque de energía colosal.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `🔥 *${personaje.nombre} liberó una explosión de poder devastador.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `💥 *${personaje.nombre} cargó su aura al máximo y se sintió más fuerte.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `🌪️ *${personaje.nombre} invocó un huracán de energía que sacudió todo a su alrededor.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `💠 *${personaje.nombre} sintió cómo su cuerpo se llenaba de una energía mística.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `🌟 *${personaje.nombre} canalizó una fuerza divina y aumentó su poder.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `🔮 *${personaje.nombre} absorbió la energía del entorno y se volvió más fuerte.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `💣 *${personaje.nombre} liberó una onda de choque destructiva.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `☄️ *${personaje.nombre} arrojó un meteorito de energía hacia su enemigo.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `🌌 *${personaje.nombre} entró en un estado de máxima concentración y su aura brilló intensamente.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
        ];

        // Respuesta al comando
        const mensajeAleatorio = textos[Math.floor(Math.random() * textos.length)];
        await conn.sendMessage(
            m.chat,
            { text: mensajeAleatorio },
            { quoted: m }
        );
    } catch (error) {
        console.error('❌ Error en el comando .poder:', error);
        m.reply('❌ *Ocurrió un error al intentar usar el comando. Intenta nuevamente.*');
    }
}
break;
	
case 'volar': {
    try {
        await m.react('🕊️'); // Reacción al usar el comando

        const userId = m.sender;
        if (!cartera[userId] || !Array.isArray(cartera[userId].personajes) || cartera[userId].personajes.length === 0) {
            return conn.sendMessage(
                m.chat,
                { text: "⚠️ *No tienes personajes en tu cartera.* Usa `.comprar` para obtener uno." },
                { quoted: m }
            );
        }

        const personaje = cartera[userId].personajes[0]; // Usar el primer personaje de la lista
        const now = Date.now();

        // Verificar intervalo de tiempo (5 min)
        if (personaje.lastVolar && now - personaje.lastVolar < 5 * 60 * 1000) {
            const remaining = Math.ceil((5 * 60 * 1000 - (now - personaje.lastVolar)) / 1000);
            return conn.sendMessage(
                m.chat,
                { text: `⏳ *Debes esperar ${remaining} segundos antes de usar este comando nuevamente.*` },
                { quoted: m }
            );
        }

        // Verificar si el personaje está muerto
        if (personaje.stats.vida <= 0) {
            return conn.sendMessage(
                m.chat,
                { text: `💀 *${personaje.nombre} ha muerto.* Usa \`.bolasdeldragon\` para revivirlo.` },
                { quoted: m }
            );
        }

        // Generar XP y monedas aleatorias
        const xpGanada = Math.floor(Math.random() * 700) + 300; // Entre 300 y 1000 XP
        const coinsGanadas = Math.floor(Math.random() * 200) + 100; // Entre 100 y 300 Coins
        const vidaPerdida = Math.floor(Math.random() * 10) + 5; // Entre 5 y 15 de vida perdida

        personaje.stats.experiencia += xpGanada;
        personaje.stats.vida -= vidaPerdida;

        // Asegurar que la vida no sea menor a 0
        if (personaje.stats.vida < 0) {
            personaje.stats.vida = 0;
        }

        // Sumar Cortana Coins al usuario
        cartera[userId].coins += coinsGanadas;

        // Subir de nivel si alcanza la experiencia necesaria
        if (personaje.stats.experiencia >= personaje.stats.experienciaSiguienteNivel) {
            personaje.stats.nivel++;
            personaje.stats.experiencia -= personaje.stats.experienciaSiguienteNivel;
            personaje.stats.experienciaSiguienteNivel += 500; // Aumenta la XP necesaria para subir de nivel

            // Notificar subida de nivel
            await conn.sendMessage(
                m.chat,
                {
                    text: `🎉 *¡Felicidades! ${personaje.nombre} ha subido al nivel ${personaje.stats.nivel}.*  
                    📊 *Nueva XP requerida para el siguiente nivel:* ${personaje.stats.experienciaSiguienteNivel}  
                    💖 *Vida restante:* ${personaje.stats.vida}/100`,
                },
                { quoted: m }
            );
        }

        // Subir nivel de habilidades aleatoriamente
        const habilidadAleatoria = personaje.habilidades[Math.floor(Math.random() * personaje.habilidades.length)];
        habilidadAleatoria.nivel++;

        // Guardar la última vez que usó el comando
        personaje.lastVolar = now;

        // Guardar cambios en el archivo
        fs.writeFileSync('./cartera.json', JSON.stringify(cartera, null, 2));

        // Textos aleatorios con emojis
        const textos = [
            `🚀 *${personaje.nombre} voló por los cielos y mejoró su entrenamiento.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `🕊️ *${personaje.nombre} surcó los cielos con gran velocidad.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `☁️ *${personaje.nombre} se elevó entre las nubes y sintió una gran energía.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `🔥 *${personaje.nombre} voló a toda potencia y mejoró su resistencia.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `💨 *${personaje.nombre} esquivó rayos mientras volaba rápidamente.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `🌠 *${personaje.nombre} atravesó la atmósfera con un poderoso impulso.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `🌀 *${personaje.nombre} practicó maniobras aéreas y mejoró su técnica.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `⚡ *${personaje.nombre} aceleró a una velocidad increíble y aumentó su energía.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `💥 *${personaje.nombre} realizó un vuelo supersónico con éxito.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
            `🔮 *${personaje.nombre} experimentó un misterioso poder en el aire.*\n✨ *Ganaste ${xpGanada} XP y 🪙 ${coinsGanadas} Cortana Coins.*`,
        ];

        // Respuesta al comando
        const mensajeAleatorio = textos[Math.floor(Math.random() * textos.length)];
        await conn.sendMessage(
            m.chat,
            { text: mensajeAleatorio },
            { quoted: m }
        );
    } catch (error) {
        console.error('❌ Error en el comando .volar:', error);
        m.reply('❌ *Ocurrió un error al intentar usar el comando. Intenta nuevamente.*');
    }
}
break;

case 'luchar': {
    try {
        await m.react('⚔️'); // Reacción al usar el comando

        const userId = m.sender;

        // Verificar si el usuario tiene personajes en su cartera
        if (!cartera[userId] || !cartera[userId].personajes || cartera[userId].personajes.length === 0) {
            return conn.sendMessage(
                m.chat,
                { text: "⚠️ *No tienes personajes en tu cartera.* Usa `.damelo` o `.comprar` para obtener uno." },
                { quoted: m }
            );
        }

        // **Tomar automáticamente el primer personaje en la lista**
        let personaje = cartera[userId].personajes[0];

        // **Sistema de cooldown (5 minutos)**
        const now = Date.now();
        if (personaje.lastFight && now - personaje.lastFight < 5 * 60 * 1000) {
            const remaining = Math.ceil((5 * 60 * 1000 - (now - personaje.lastFight)) / 1000);
            return conn.sendMessage(
                m.chat,
                { text: `⏳ *Debes esperar ${remaining} segundos antes de volver a luchar.*` },
                { quoted: m }
            );
        }

        // **Generar XP y monedas aleatorias**
        const xpGanada = Math.floor(Math.random() * 500) + 300; // Entre 300 y 800 XP
        const coinsGanadas = Math.floor(Math.random() * 500) + 300; // Entre 300 y 800 Cortana Coins
        personaje.stats.experiencia += xpGanada;
        cartera[userId].coins += coinsGanadas;

        // **Reducir vida aleatoriamente**
        const vidaPerdida = Math.floor(Math.random() * 10) + 5; // Entre 5 y 15 de vida menos
        personaje.stats.vida -= vidaPerdida;

        // **Si la vida llega a 0, notificar al usuario**
        if (personaje.stats.vida <= 0) {
            personaje.stats.vida = 0;
            return conn.sendMessage(
                m.chat,
                { text: `☠️ *${personaje.nombre} ha caído en batalla.*\n💀 Usa \`.bolasdeldragon\` para revivirlo.` },
                { quoted: m }
            );
        }

        // **Subir de nivel si la XP es suficiente**
        if (personaje.stats.experiencia >= personaje.stats.experienciaSiguienteNivel) {
            personaje.stats.nivel++;
            personaje.stats.experiencia -= personaje.stats.experienciaSiguienteNivel;
            personaje.stats.experienciaSiguienteNivel += 500 * personaje.stats.nivel;

            // **Subir de nivel una habilidad aleatoria**
            const habilidadAleatoria = personaje.habilidades[Math.floor(Math.random() * personaje.habilidades.length)];
            habilidadAleatoria.nivel++;

            // Notificar al usuario sobre la subida de nivel y habilidad
            await conn.sendMessage(
                m.chat,
                { text: `🎉 *¡${personaje.nombre} ha subido a nivel ${personaje.stats.nivel}!*  
                ✨ *Habilidad mejorada:* ${habilidadAleatoria.nombre} (Nivel ${habilidadAleatoria.nivel})` },
                { quoted: m }
            );
        }

        // Guardar el tiempo de uso del comando
        personaje.lastFight = now;

        // **Guardar cambios en el archivo cartera.json**
        fs.writeFileSync('./cartera.json', JSON.stringify(cartera, null, 2));

        // **Mensajes aleatorios de batalla**
        const textos = [
            `⚔️ *${personaje.nombre} luchó contra un enemigo y salió victorioso!*  
⭐ *Ganaste ${xpGanada} XP* y 🪙 *${coinsGanadas} Cortana Coins.*`,
            `⚔️ *${personaje.nombre} se enfrentó a un duro oponente y logró vencer.*  
⭐ *Ganaste ${xpGanada} XP* y 🪙 *${coinsGanadas} Cortana Coins.*`,
            `⚔️ *${personaje.nombre} desató todo su poder en la batalla.*  
⭐ *Ganaste ${xpGanada} XP* y 🪙 *${coinsGanadas} Cortana Coins.*`,
            `⚔️ *${personaje.nombre} peleó con todas sus fuerzas y se superó a sí mismo.*  
⭐ *Ganaste ${xpGanada} XP* y 🪙 *${coinsGanadas} Cortana Coins.*`,
            `⚔️ *${personaje.nombre} esquivó ataques y golpeó con gran precisión.*  
⭐ *Ganaste ${xpGanada} XP* y 🪙 *${coinsGanadas} Cortana Coins.*`,
            `⚔️ *${personaje.nombre} encontró un punto débil en su enemigo y lo aprovechó.*  
⭐ *Ganaste ${xpGanada} XP* y 🪙 *${coinsGanadas} Cortana Coins.*`,
            `⚔️ *${personaje.nombre} ejecutó una técnica especial para ganar la pelea.*  
⭐ *Ganaste ${xpGanada} XP* y 🪙 *${coinsGanadas} Cortana Coins.*`,
            `⚔️ *${personaje.nombre} utilizó toda su estrategia y venció al adversario.*  
⭐ *Ganaste ${xpGanada} XP* y 🪙 *${coinsGanadas} Cortana Coins.*`,
            `⚔️ *${personaje.nombre} combatió con determinación y logró la victoria.*  
⭐ *Ganaste ${xpGanada} XP* y 🪙 *${coinsGanadas} Cortana Coins.*`,
            `⚔️ *${personaje.nombre} peleó con honor y salió más fuerte que antes.*  
⭐ *Ganaste ${xpGanada} XP* y 🪙 *${coinsGanadas} Cortana Coins.*`,
        ];

        // **Seleccionar un mensaje aleatorio y enviarlo**
        const mensajeBatalla = textos[Math.floor(Math.random() * textos.length)];
        return conn.sendMessage(
            m.chat,
            { text: mensajeBatalla },
            { quoted: m }
        );

    } catch (error) {
        console.error('❌ Error en el comando .luchar:', error);
        return conn.sendMessage(
            m.chat,
            { text: "❌ *Ocurrió un error al intentar luchar. Intenta nuevamente.*" },
            { quoted: m }
        );
    }
}
break;
	
case 'damelo': {
    try {
        const userId = m.sender;

        // Verificar si hay personajes en la tienda free
        if (!cartera.tiendaFree || cartera.tiendaFree.length === 0) {
            return conn.sendMessage(
                m.chat,
                { text: "⚠️ *No hay personajes disponibles para reclamar en este momento.*" },
                { quoted: m }
            );
        }

        // Obtener el primer personaje de la tienda free
        const personajeReclamado = cartera.tiendaFree.shift(); // Saca el primer personaje disponible

        // Verificar si el usuario tiene una cartera, si no, crearla
        if (!cartera[userId]) {
            cartera[userId] = {
                coins: 0,
                mascotas: [],
                personajes: []
            };
        }

        // Asegurar que el usuario tenga el array de personajes
        if (!Array.isArray(cartera[userId].personajes)) {
            cartera[userId].personajes = [];
        }

        // Agregar el personaje a la cartera del usuario
        cartera[userId].personajes.push(personajeReclamado);

        // Guardar los cambios en `cartera.json`
        fs.writeFileSync('./cartera.json', JSON.stringify(cartera, null, 2));

        // 📢 Mensaje de confirmación con mención correcta
        let mensajeReclamo = `
🎉 *¡@${userId.replace(/@s.whatsapp.net/, '')} ha reclamado un personaje GRATIS!* 🎉  

📌 *Ficha de Personaje:*  
🎭 *Nombre:* ${personajeReclamado.nombre}  
⚔️ *Nivel:* ${personajeReclamado.stats.nivel}  
💖 *Vida:* ${personajeReclamado.stats.vida}/100  
🧬 *EXP:* ${personajeReclamado.stats.experiencia} / ${personajeReclamado.stats.experienciaSiguienteNivel}  

🎯 *Habilidades:*  
⚡ ${personajeReclamado.habilidades[0].nombre} (Nivel 1)  
⚡ ${personajeReclamado.habilidades[1].nombre} (Nivel 1)  
⚡ ${personajeReclamado.habilidades[2].nombre} (Nivel 1)  

📜 *Consulta tus personajes con:* \`.verpersonajes\`
        `;

        // Enviar mensaje con la imagen del personaje y mención del usuario correctamente
        await conn.sendMessage(
            m.chat,
            {
                image: Buffer.from(personajeReclamado.imagen, 'base64'),
                mimetype: personajeReclamado.mimetype,
                caption: mensajeReclamo,
                mentions: [userId]
            },
            { quoted: m }
        );

    } catch (error) {
        console.error('❌ Error en el comando .damelo:', error);
        return conn.sendMessage(
            m.chat,
            { text: "❌ *Ocurrió un error al intentar reclamar el personaje. Intenta nuevamente.*" },
            { quoted: m }
        );
    }
}
break;