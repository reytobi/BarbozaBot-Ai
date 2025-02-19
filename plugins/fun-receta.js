
const recetas = {
  galletas: {
    nombre: "Galletas de Chispas de Chocolate",
    ingredientes: [
      "1 taza de mantequilla",
      "1 taza de azúcar",
      "1 taza de azúcar moreno",
      "2 huevos",
      "2 cucharaditas de extracto de vainilla",
      "3 tazas de harina",
      "1 cucharadita de bicarbonato de sodio",
      "1/2 cucharadita de sal",
      "2 tazas de chispas de chocolate"
    ],
    instrucciones: `1. Precalentar el horno a 180°C (350°F).
2. Batir la mantequilla, el azúcar y el azúcar moreno hasta que esté cremoso.
3. Agregar los huevos y la vainilla, y mezclar bien.
4. En otro tazón, mezclar la harina, el bicarbonato y la sal.
5. Agregar los ingredientes secos a la mezcla húmeda y mezclar.
6. Incorporar las chispas de chocolate.
7. Hacer bolitas con la masa y colocarlas en una bandeja para hornear.
8. Hornear durante 10-12 minutos o hasta que estén doradas.
9. Dejar enfriar y ¡disfrutar!`
  },
  ensalada: {
    nombre: "Ensalada César",
    ingredientes: [
      "Lechuga romana",
      "Crutones",
      "Queso parmesano rallado",
      "Aderezo César al gusto"
    ],
    instrucciones: `1. Lavar y trocear la lechuga romana.
2. En un tazón grande, mezclar la lechuga con los crutones y el queso parmesano.
3. Añadir el aderezo César al gusto y mezclar bien.
4. Servir inmediatamente.`
  }
};

function handler(m, { args }) {
  const recetaNombre = args[0]?.toLowerCase();
  
  if (!recetaNombre || !recetas[recetaNombre]) {
    return m.reply("Por favor, usa .recetas [nombre] para obtener una receta.\nEjemplo: .recetas galletas");
  }

  const receta = recetas[recetaNombre];

  let mensaje = `📜 *${receta.nombre}* 📜\n\n*Ingredientes:*\n${receta.ingredientes.join('\n')}\n\n*Instrucciones:*\n${receta.instrucciones}`;
  
  m.reply(mensaje);
}

handler.help = ['recetas [nombre]'];
handler.tags = ['fun'];
handler.command = ['recetas'];
handler.group = true;

export default handler;