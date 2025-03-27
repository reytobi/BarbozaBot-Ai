const fs = require("fs");
const path = require("path");

async function analizarBot(socket, from) {
    await socket.sendMessage(from, { text: "Espéreme ^^" });

    const folderPath = path.join(__dirname, ".."); // Carpeta del bot
    let errores = [];

    function analizarArchivo(ruta) {
        try {
            new Function(fs.readFileSync(ruta, "utf8")); // Intenta analizar el código
        } catch (error) {
            errores.push(`❌ Error en ${path.relative(folderPath, ruta)}: ${error.message}`);
        }
    }

    function recorrerCarpeta(carpeta) {
        fs.readdirSync(carpeta).forEach((archivo) => {
            const rutaCompleta = path.join(carpeta, archivo);
            if (fs.statSync(rutaCompleta).isDirectory()) {
                recorrerCarpeta(rutaCompleta); // Revisar subcarpetas
            } else if (archivo.endsWith(".js")) {
                analizarArchivo(rutaCompleta);
            }
        });
    }

    recorrerCarpeta(folderPath);

    if (errores.length === 0) {
        await socket.sendMessage(from, { text: "✅ No se encontraron errores en el bot." });
    } else {
        await socket.sendMessage(from, { text: "⚠️ Se encontraron errores:\n\n" + errores.join("\n") });
    }
}

module.exports = re;