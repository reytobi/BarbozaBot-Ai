//codigo barboza 
let recetas = {
    "tortilla": {
        ingredientes: "4 huevos, 2 patatas, 1 cebolla, sal al gusto.",
        instrucciones: "1. Pela y corta las patatas y la cebolla. 2. Fríelas en una sartén con aceite hasta que estén doradas. 3. Bate los huevos y mézclalos con las patatas y la cebolla. 4. Vierte la mezcla en la sartén y cocina hasta que esté dorada por ambos lados."
    },
    "ensalada": {
        ingredientes: "1 lechuga, 2 tomates, 1 pepino, aceite de oliva, vinagre, sal.",
        instrucciones: "1. Lava y corta todos los ingredientes. 2. Mezcla en un bol grande. 3. Agrega aceite, vinagre y sal al gusto."
    },

  "pizza casera" : {
    ingredientes: "250g de harina, 150ml de agua, 7g de levadura seca, salsa de tomate, queso mozzarella, ingredientes al gusto.",
    instrucciones: "1. Mezcla la harina con la levadura y agua para hacer la masa. Deja reposar una hora. 2. Extiende la masa y cubre con salsa y queso. 3. Añade los ingredientes que desees y hornea a 220°C durante unos 15-20 minutos."
},

  "tacos de pollo": {
    ingredientes: "300g de pechuga de pollo, 8 tortillas, 1 cebolla, 1 pimiento, guacamole, salsa al gusto.",
    instrucciones: "1. Cocina la pechuga de pollo en una sartén y desmenúzala. 2. Sofríe la cebolla y el pimiento hasta que estén tiernos. 3. Calienta las tortillas. 4. Sirve el pollo en las tortillas y agrega guacamole y salsa."
};

    "spaghetti carbonara": {
        ingredientes: "200g de spaghetti, 100g de panceta, 2 huevos, 50g de queso parmesano, sal y pimienta al gusto.",
        instrucciones: "1. Cocina los spaghetti en agua hirviendo con sal hasta que estén al dente. 2. Mientras tanto, fríe la panceta en una sartén hasta que esté crujiente. 3. Bate los huevos con el queso parmesano y añade sal y pimienta. 4. Escurre los spaghetti y mezcla rápidamente con la panceta caliente y la mezcla de huevo."
    },
    "pollo al horno": {
        ingredientes: "1 pollo entero, 4 dientes de ajo, limón, hierbas provenzales, aceite de oliva, sal.",
        instrucciones: "1. Precalienta el horno a 200°C. 2. Mezcla el ajo picado, jugo de limón, hierbas y aceite para hacer una marinada. 3. Unta el pollo con la marinada y colócalo en una bandeja para hornear. 4. Hornea durante aproximadamente 90 minutos o hasta que esté dorado."
    },
    "guiso de lentejas": {
        ingredientes: "250g de lentejas, 1 cebolla, 2 zanahorias, 2 dientes de ajo, caldo de verduras.",
        instrucciones: "1. Sofríe la cebolla y el ajo picados en una olla grande hasta que estén dorados. 2. Añade las zanahorias cortadas y cocina por unos minutos más. 3. Agrega las lentejas y suficiente caldo para cubrirlas completamente. Cocina a fuego lento durante aproximadamente 30-40 minutos."
    },
    // Puedes agregar más recetas aquí
};

let handler = async (m, { conn, text }) => {
    // Verificar si se ha proporcionado el nombre de la receta
    if (!text) {
        return conn.sendMessage(m.chat, { text: "Por favor, proporciona el nombre de una receta. Ejemplo: .receta tortilla" }, { quoted: m });
    }

    let recetaNombre = text.toLowerCase(); // Convertir a minúsculas para evitar problemas de coincidencia

    if (recetas[recetaNombre]) {
        let receta = recetas[recetaNombre];
        let mensajeReceta = 🍽️ *Receta de ${recetaNombre.charAt(0).toUpperCase() + recetaNombre.slice(1)}*\n\n*Ingredientes:* ${receta.ingredientes}\n\n*Instrucciones:* ${receta.instrucciones};
        await conn.sendMessage(m.chat, { text: mensajeReceta }, { quoted: m });
    } else {
        await conn.sendMessage(m.chat, { text: ⚠️ No tengo la receta para "${recetaNombre}". Intenta con otra. }, { quoted: m });
    }
}

handler.help = ['receta <nombre>'];
handler.tags = ['cocina'];
handler.command = ['receta'];

export default handler;