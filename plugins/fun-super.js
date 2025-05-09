
const handler = async (m, { conn}) => {
    const escenarios = [
        {
            descripcion: "Te encuentras perdido en un bosque oscuro. Solo tienes una linterna y poca batería.",
            opciones: ["Buscar refugio en una cueva", "Seguir un río para encontrar salida", "Encender fuego para llamar la atención"],
            correctas: [1]
},
        {
            descripcion: "Tu barco se hundió y llegaste a una isla desierta. Hay señales de animales peligrosos.",
            opciones: ["Construir un refugio", "Buscar comida primero", "Explorar la isla"],
            correctas: [0]
},
        {
            descripcion: "Estás atrapado en una ciudad abandonada después de un desastre. Hay poca agua disponible.",
            opciones: ["Buscar provisiones en un supermercado", "Refugiarse en un edificio alto", "Tratar de contactar a sobrevivientes"],
            correctas: [0, 2]
},
        {
            descripcion: "Eres un astronauta que ha quedado atrapado en una nave averiada en el espacio.",
            opciones: ["Intentar reparar los sistemas eléctricos", "Lanzar una señal de emergencia", "Usar el oxígeno restante para explorar afuera"],
            correctas: [1]
},
        {
            descripcion: "Te despiertas en un desierto sin rastro de civilización cerca.",
            opciones: ["Caminar hasta encontrar un oasis", "Enterrarte parcialmente en la arena para conservar energía", "Buscar rocas para refugio contra el sol"],
            correctas: [0, 2]
},
        {
            descripcion: "Una tormenta de nieve repentina te atrapa en una montaña sin refugio cercano.",
            opciones: ["Construir un iglú improvisado", "Descender rápido sin protección", "Encender una fogata con los materiales disponibles"],
            correctas: [0, 2]
}
    ];

    const escenario = escenarios[Math.floor(Math.random() * escenarios.length)];

    let mensaje = `🔥 *Modo Supervivencia* 🔥\n\n📜 *Situación:* ${escenario.descripcion}\n\n`;
    escenario.opciones.forEach((opcion, i) => {
        mensaje += `🔹 ${i + 1}. ${opcion}\n`;
});

    mensaje += "\n📌 *Responde con el número de la opción que elijas.*";

    conn.survivalGame = conn.survivalGame || {};
    conn.survivalGame[m.chat] = {
        correctas: escenario.correctas
};

    await conn.sendMessage(m.chat, { text: mensaje});
};

handler.before = async (m, { conn}) => {
    if (conn.survivalGame && conn.survivalGame[m.chat]) {
        const respuesta = parseInt(m.text.trim());
        const correctas = conn.survivalGame[m.chat].correctas;

        if (correctas.includes(respuesta - 1)) {
            delete conn.survivalGame[m.chat];
            return conn.reply(m.chat, `✅ *Buena elección!* Has aumentado tus probabilidades de supervivencia.`, m);
} else {
            delete conn.survivalGame[m.chat];
            return conn.reply(m.chat, `❌ *Decisión arriesgada!* Esto podría complicar tu situación...`, m);
}
}
};

handler.command = ["supervivencia"];
export default handler;