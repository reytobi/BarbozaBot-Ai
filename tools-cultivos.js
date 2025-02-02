import fs from 'fs';

const filePath = './cultivos.json';

// Configuración de frutas disponibles
const frutas = {
    "🍎 Manzana": {
        precio: 50,
        tiempoCrecimiento: 1800000, // 30 minutos
        produccionBase: 3,
        recompensa: 15,
        nivelMax: 5
    },
    "🍊 Naranja": {
        precio: 75,
        tiempoCrecimiento: 3600000, // 1 hora
        produccionBase: 5,
        recompensa: 25,
        nivelMax: 5
    },
    "🍇 Uvas": {
        precio: 100,
        tiempoCrecimiento: 7200000, // 2 horas
        produccionBase: 8,
        recompensa: 40,
        nivelMax: 5
    },
    "🍓 Fresa": {
        precio: 60,
        tiempoCrecimiento: 900000, // 15 minutos
        produccionBase: 4,
        recompensa: 20,
        nivelMax: 5
    },
    "🍐 Pera": {
        precio: 85,
        tiempoCrecimiento: 5400000, // 1.5 horas
        produccionBase: 6,
        recompensa: 30,
        nivelMax: 5
    }
};

// Funciones de utilidad
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
    if (tiempoRestante <= 0) return "0 minutos";
    
    let horas = Math.floor(tiempoRestante / 3600000);
    let minutos = Math.floor((tiempoRestante % 3600000) / 60000);
    
    if (horas > 0) {
        return `${horas} horas y ${minutos} minutos`;
    }
    return `${minutos} minutos`;
};

const obtenerEstadoCultivo = (tiempoTranscurrido, tiempoCrecimiento) => {
    const porcentaje = (tiempoTranscurrido / tiempoCrecimiento) * 100;
    if (porcentaje >= 100) return "✅ Listo para cosechar";
    if (porcentaje >= 75) return "🌳 Casi maduro";
    if (porcentaje >= 50) return "🌱 Creciendo bien";
    if (porcentaje >= 25) return "🌱 Pequeño";
    return "🌱 Recién plantado";
};

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
            return m</antArtifact>