let handler = async (m, { conn, command, args, usedPrefix }) => {
    let usuarios = leerDatos();
    let usuario = usuarios[m.sender] || {
        dinero: 200,
        cultivos: {},
        abono: 0,
        aguaDisponible: 5,
        ultimoRiego: {}
    };

    switch (command) {
        case 'frutas':
            let listaFrutas = Object.entries(frutas).map(([nombre, data]) => 
                `${nombre} - 💰 ${data.precio} (Produce: ${data.produccionBase} cada ${calcularTiempoRestante(data.tiempoCrecimiento)})`
            ).join('\n');
            return m.reply(`🌱 *Frutas disponibles para cultivar:*\n\n${listaFrutas}\n\nUsa *${usedPrefix}plantar [nombre]* para comenzar a cultivar.`);

        case 'plantar':
            let nombreFruta = args.join(' ');
            if (!frutas[nombreFruta]) {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return m.reply("❌ Fruta no encontrada. Usa *frutas* para ver la lista.");
            }
            if (usuario.dinero < frutas[nombreFruta].precio) {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return m.reply("❌ No tienes suficiente dinero.");
            }

            usuario.dinero -= frutas[nombreFruta].precio;
            usuario.cultivos[nombreFruta] = {
                tiempoPlantado: Date.now(),
                nivel: 1,
                regado: false,
                abonado: false
            };
            
            usuarios[m.sender] = usuario;
            guardarDatos(usuarios);
            
            await conn.sendMessage(m.chat, { react: { text: "🌱", key: m.key } });
            return m.reply(`🌱 Has plantado ${nombreFruta}. Usa *${usedPrefix}regar* para mantenerla saludable.`);

        case 'regar':
            if (Object.keys(usuario.cultivos).length === 0) {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return m.reply("❌ No tienes cultivos para regar.");
            }
            if (usuario.aguaDisponible <= 0) {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return m.reply("❌ No tienes agua disponible. Espera a que se rellene.");
            }

            let cultivosRegados = 0;
            for (let [nombreFruta, cultivo] of Object.entries(usuario.cultivos)) {
                if (!cultivo.regado) {
                    cultivo.regado = true;
                    cultivosRegados++;
                    usuario.ultimoRiego[nombreFruta] = Date.now();
                }
            }

            if (cultivosRegados === 0) {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return m.reply("❌ Tus cultivos ya están regados.");
            }

            usuario.aguaDisponible--;
            usuarios[m.sender] = usuario;
            guardarDatos(usuarios);

            await conn.sendMessage(m.chat, { react: { text: "💧", key: m.key } });
            return m.reply(`💧 Has regado ${cultivosRegados} cultivos. Agua restante: ${usuario.aguaDisponible}`);

        case 'abonar':
            if (Object.keys(usuario.cultivos).length === 0) {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return m.reply("❌ No tienes cultivos para abonar.");
            }
            if (usuario.abono <= 0) {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return m.reply("❌ No tienes abono. Usa *comprarabono* para obtener más.");
            }

            let cultivosAbonados = 0;
            for (let [nombreFruta, cultivo] of Object.entries(usuario.cultivos)) {
                if (!cultivo.abonado) {
                    cultivo.abonado = true;
                    cultivosAbonados++;
                }
            }

            if (cultivosAbonados === 0) {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return m.reply("❌ Tus cultivos ya están abonados.");
            }

            usuario.abono--;
            usuarios[m.sender] = usuario;
            guardarDatos(usuarios);

            await conn.sendMessage(m.chat, { react: { text: "🌱", key: m.key } });
            return m.reply(`🌱 Has abonado ${cultivosAbonados} cultivos. Abono restante: ${usuario.abono}`);

        case 'comprarabono':
            let cantidad = parseInt(args[0]);
            if (!cantidad || cantidad <= 0) {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return m.reply("❌ Ingresa una cantidad válida.");
            }

            let costoAbono = cantidad * 20;
            if (usuario.dinero < costoAbono) {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return m.reply("❌ No tienes suficiente dinero.");
            }

            usuario.dinero -= costoAbono;
            usuario.abono += cantidad;
            usuarios[m.sender] = usuario;
            guardarDatos(usuarios);

            await conn.sendMessage(m.chat, { react: { text: "🌱", key: m.key } });
            return m.reply(`🌱 Has comprado ${cantidad} abono por 💰 ${costoAbono}. Ahora tienes ${usuario.abono} abono.`);

        case 'cosechar':
            if (Object.keys(usuario.cultivos).length === 0) {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return m.reply("❌ No tienes cultivos para cosechar.");
            }

            let cosecha = [];
            let cultivosParaEliminar = [];
            let gananciasTotal = 0;

            for (let [nombreFruta, cultivo] of Object.entries(usuario.cultivos)) {
                let tiempoTranscurrido = Date.now() - cultivo.tiempoPlantado;
                let frutaInfo = frutas[nombreFruta];

                if (tiempoTranscurrido >= frutaInfo.tiempoCrecimiento) {
                    let produccion = frutaInfo.produccionBase * cultivo.nivel;
                    if (cultivo.regado) produccion *= 1.5;
                    if (cultivo.abonado) produccion *= 2;

                    let ganancias = Math.floor(produccion * frutaInfo.recompensa);
                    gananciasTotal += ganancias;
                    cosecha.push(`${nombreFruta}: ${Math.floor(produccion)} unidades (💰 ${ganancias})`);
                    cultivosParaEliminar.push(nombreFruta);
                }
            }

            if (cosecha.length === 0) {
                await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
                return m.reply("⏳ Ningún cultivo está listo para cosechar aún.");
            }

            // Eliminar cultivos cosechados y actualizar dinero
            cultivosParaEliminar.forEach(nombreFruta => {
                delete usuario.cultivos[nombreFruta];
            });

            usuario.dinero += gananciasTotal;
            usuarios[m.sender] = usuario;
            guardarDatos(usuarios);

            await conn.sendMessage(m.chat, { react: { text: "🌾", key: m.key } });
            return m.reply(
                `🌾 *Cosecha realizada:*\n${cosecha.join('\n')}\n\n` +
                `💰 Ganancias totales: ${gananciasTotal}\n` +
                `💰 Dinero actual: ${usuario.dinero}`
            );

        case 'miscultivos':
            if (Object.keys(usuario.cultivos).length === 0) {
                return m.reply("❌ No tienes cultivos activos.");
            }

            let listaCultivos = [];
            for (let [nombreFruta, cultivo] of Object.entries(usuario.cultivos)) {
                let tiempoTranscurrido = Date.now() - cultivo.tiempoPlantado;
                let frutaInfo = frutas[nombreFruta];
                let estado = obtenerEstadoCultivo(tiempoTranscurrido, frutaInfo.tiempoCrecimiento);
                let tiempoRestante = Math.max(0, frutaInfo.tiempoCrecimiento - tiempoTranscurrido);

                listaCultivos.push(
                    `${nombreFruta} (Nivel ${cultivo.nivel}):\n` +
                    `Estado: ${estado}\n` +
                    `Regado: ${cultivo.regado ? '✅' : '❌'}\n` +
                    `Abonado: ${cultivo.abonado ? '✅' : '❌'}\n` +
                    `⏳ Tiempo restante: ${calcularTiempoRestante(tiempoRestante)}\n`
                );
            }

            await conn.sendMessage(m.chat, { react: { text: "🌱", key: m.key } });
            return m.reply(
                `🌱 *Tus cultivos:*\n\n${listaCultivos.join('\n')}\n` +
                `💰 Dinero: ${usuario.dinero}\n` +
                `💧 Agua disponible: ${usuario.aguaDisponible}\n` +
                `🌱 Abono disponible: ${usuario.abono}`
            );

        case 'mejorar':
            let frutaMejorar = args.join(' ');
            if (!usuario.cultivos[frutaMejorar]) {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return m.reply("❌ No tienes esa fruta plantada.");
            }

            let cultivo = usuario.cultivos[frutaMejorar];
            let frutaInfo = frutas[frutaMejorar];
            let costoMejora = Math.floor(frutaInfo.precio * (cultivo.nivel * 1.5));

            if (cultivo.nivel >= frutaInfo.nivelMax) {
                await conn.sendMessage(m.chat, { react: { text: "⭐", key: m.key } });
                return m.reply("⭐ Este cultivo ya está en su nivel máximo.");
            }

            if (usuario.dinero < costoMejora) {
                await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return m.reply(`❌ Necesitas 💰 ${costoMejora} para mejorar este cultivo.`);
            }

            usuario.dinero -= costoMejora;
            cultivo.nivel++;
            usuarios[m.sender] = usuario;
            guardarDatos(usuarios);

            await conn.sendMessage(m.chat, { react: { text: "⬆️", key: m.key } });
            return m.reply(
                `⬆️ Has mejorado ${frutaMejorar} al nivel ${cultivo.nivel}\n` +
                `💰 Costo: ${costoMejora}\n` +
                `💰 Dinero restante: ${usuario.dinero}`
            );

        default:
            return m.reply("❌ Comando no reconocido.");
    }
};

export default handler;