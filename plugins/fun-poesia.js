
let poesías = [
    `
🌟✨ *Poesía para ti* ✨🌟

En el jardín de la vida, florece el amor,  
cada pétalo es un susurro, un dulce clamor.  
Las estrellas brillan en la noche serena,  
y en cada latido, tú eres la vena.
    `,
    `
🌈 *Verso de esperanza* 🌈

Cuando la tormenta oscurece el cielo,  
recuerda que siempre hay un destello.  
Las nubes se van y vuelve el sol,  
brillando en tu vida con todo su rol.
    `,
    `
🍃 *Susurros del viento* 🍃

El viento sopla suave entre los árboles,  
susurra secretos que nunca son inalcanzables.  
Cada hoja que cae tiene su razón,  
y en cada cambio, hay una canción.
    `,
    `
🌹 *Reflejo del alma* 🌹

En el espejo del alma brilla la verdad,  
un reflejo sincero de nuestra humanidad.  
Cada lágrima caída es un paso más,  
en este viaje eterno hacia la paz.
    `,
    `
🦋 *Danza de mariposas* 🦋

Las mariposas juegan en un baile sutil,  
colores que pintan el aire febril.  
Cada aleteo cuenta historias de amor,  
susurros de vida en un mundo mejor.
    `,
    `
🌌 *Noche estrellada* 🌌

La noche se viste con su manto estelar,  
cada estrella es un sueño por realizar.  
Mira hacia arriba y deja volar tu ser,  
pues en cada constelación hay algo por aprender.
    `,
    `
☀️ *Renacer* ☀️

Como el sol que se asoma tras la tempestad,  
renacemos con fuerza y con dignidad.  
Cada día es una página nueva a escribir,  
con tinta de sueños y ganas de vivir.

  *Caminos de sueños* 🌼

    En el sendero de los sueños, un paso firme,  
    cada huella deja un eco que nunca se rinde.  
    La vida es un viaje, no un destino,  
    y en cada curva, hay un nuevo camino.
    ,
    
    🌊 *Olas del mar* 🌊

    Las olas susurran secretos al amanecer,  
    el murmullo del mar nos invita a creer.  
    Cada ola que rompe trae un nuevo latir,  
    en su danza eterna, aprendemos a vivir.
    ,
    
    🍂 *Ciclo de la vida* 🍂

    Las estaciones cambian, el tiempo avanza,  
    en cada ciclo hay una nueva esperanza.  
    El otoño nos enseña a soltar lo viejo,  
    y en cada despedida hay un bello consejo.
    ,
    
    🎈 *Volar alto* 🎈

    Como un globo que asciende hacia el cielo azul,  
    nuestros sueños nos llevan a un mundo sin igual.  
    No temas dejar atrás lo que pesa en tu ser,  
    vuela alto y libre, empieza a renacer.
    ,
    
    🌻 *Brillo interior* 🌻

    La luz que brilla dentro de ti es inmensa,  
    aunque a veces la sombra parezca intensa.  
    Confía en tu esencia y deja que resplandezca,  
    porque en tu corazón la esperanza se niega.
    ,
    
    🍀 *Suerte y destino* 🍀

    La suerte es un susurro que llega sin avisar,  
    pero el destino es la fuerza que te hace luchar.  
    Confía en tus pasos y sigue adelante,  
    pues cada elección te lleva hacia un instante.
    ,
    
     🌟 *Estrella fugaz* 🌟

     Una estrella fugaz cruza el cielo oscuro,  
     dejando un deseo que se siente puro.  
     Cierra los ojos y pide con fervor,  
     porque cada instante guarda su propio esplendor.
     ,
    
     🐦 *Canto de los pájaros* 🐦

     El canto de los pájaros al amanecer,  
     es una sinfonía que invita a renacer.  
     Escucha su melodía y siente su libertad,  
     pues en cada nota hay una oportunidad.
     ,
     
     🌈 *Puente de colores* 🌈

     Un arcoíris surge tras la lluvia caer,  
     cada color es promesa de volver a creer.  
     La vida tiene matices que nos sorprenden,  
     y en cada destello nuevas historias se extienden.
     ,
     
     🕊️ *Paz interior* 🕊️

     En el silencio profundo de tu corazón,  
     encuentra la paz que abraza la razón.  
     Cada suspiro es un regalo sagrado,  
     donde la serenidad se siente a tu lado.
    `
];

let handler = async (m) => {
    let userId = m.sender; // ID del usuario
    if (!global.usedPoesias) global.usedPoesias = {}; // Inicializar si no existe
    if (!global.usedPoesias[userId]) global.usedPoesias[userId] = 0; // Contador de poesías por usuario

    let index = global.usedPoesias[userId];

    // Enviar la poesía correspondiente
    if (index < poesías.length) {
        await conn.sendMessage(m.chat, { text: poesías[index] }, { quoted: m });
        global.usedPoesias[userId] += 1; // Aumentar el contador
    } else {
        await conn.sendMessage(m.chat, { text: "Ya has recibido todas las poesías disponibles. ¡Intenta más tarde!" }, { quoted: m });
    }
}

handler.help = ['poesía'];
handler.tags = ['arte'];
handler.command = ['poesía'];

export default handler;
