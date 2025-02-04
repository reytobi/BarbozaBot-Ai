
let recetas = {
    "espaguetis": {
        ingredientes: [
            "400g de espaguetis",
            "4 dientes de ajo",
            "1/2 taza de aceite de oliva",
            "1/4 cucharadita de pimiento rojo (opcional)",
            "Sal al gusto",
            "Perejil fresco picado (opcional)",
            "Queso parmesano rallado (opcional)"
        ],
        instrucciones: "1. Cocina los espaguetis en agua hirviendo con sal hasta que estén al dente.\n2. Mientras se cocinan, calienta el aceite de oliva en una sartén a fuego medio.\n3. Agrega los dientes de ajo picados y el pimiento rojo, sofríe hasta que el ajo esté dorado.\n4. Escurre los espaguetis y agrégales a la sartén con el aceite y ajo.\n5. Mezcla bien y cocina por un par de minutos.\n6. Sirve caliente, espolvorea con perejil y queso parmesano si lo deseas."
    },
    "tacos": {
        ingredientes: [
            "8 tortillas de maíz",
            "500g de carne asada",
            "1 cebolla picada",
            "Cilantro al gusto",
            "Limones (para servir)",
            "Salsa al gusto"
        ],
        instrucciones: "1. Asa la carne a la parrilla y córtala en trozos pequeños.\n2. Calienta las tortillas en un comal.\n3. Coloca la carne sobre las tortillas y añade cebolla, cilantro y salsa al gusto.\n4. Exprime limón por encima y disfruta."
    },
    // Agrega más recetas aquí
};

let handler = async (m, { conn, text }) => {
    // Verificar si se ha proporcionado una receta
    if (!text) {
        return conn.sendMessage(m.chat, { text: "Por favor, menciona el nombre de una receta. Ejemplo: .receta espaguetis" }, { quoted: m });
    }

    let recetaNombre = text.toLowerCase(); // Convertir a minúsculas para facilitar la búsqueda

    if (recetas[recetaNombre]) {
        let { ingredientes, instrucciones } = recetas[recetaNombre];
        
        let mensajeReceta = `🍽️ **Receta: ${recetaNombre.charAt(0).toUpperCase() + recetaNombre.slice(1)}** 🍽️\n\n**Ingredientes:**\n- ${ingredientes.join('\n- ')}\n\n**Instrucciones:**\n${instrucciones}`;
        
        await conn.sendMessage(m.chat, { text: mensajeReceta }, { quoted: m });
    } else {
        return conn.sendMessage(m.chat, { text: "Lo siento, no tengo esa receta disponible." }, { quoted: m });
    }
}

handler.help = ['receta <nombre>'];
handler.tags = ['cocina'];
handler.command = ['receta'];

export default handler;