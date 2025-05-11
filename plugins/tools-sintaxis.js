
import fs from "fs";

const handler = async (m, { conn}) => {
    const folderPath = "./comandos"; // Ruta donde están los archivos de comandos
    let mensaje = "*📂 Revisión Automática de Syntax Errors* 🔍⚙️\n\n";

    try {
        const archivos = fs.readdirSync(folderPath).filter(file => file.endsWith(".js"));

        if (archivos.length === 0) {
            mensaje += "⚠️ *No se encontraron archivos de comandos para analizar.*";
            return conn.sendMessage(m.chat, { text: mensaje});
}

        for (const archivo of archivos) {
            try {
                const contenido = fs.readFileSync(`${folderPath}/${archivo}`, "utf-8");
                new Function(contenido);
                mensaje += `✅ *${archivo}* - No tiene errores de sintaxis.\n`;
} catch (error) {
                mensaje += `❌ *${archivo}* - Error detectado.\n📌 *Motivo:* ${error.message}\n`;
}
}
} catch (error) {
        mensaje += "❌ *Error al acceder a la carpeta de comandos.* Verifica la ruta o los permisos.";
}

    await conn.sendMessage(m.chat, { text: mensaje});
};

handler.command = ["sintaxis"];
export default handler;