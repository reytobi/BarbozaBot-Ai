
// Lista de preguntas con opciones y respuestas correctas
const questions = [
    {
        question: "¿Quién fue el padre de Melquisedec?",
        options: ["Abraham", "Noé", "Ninguno, Melquisedec no tenía padre"],
        answer: "C"
    },
    {
        question: "¿Cuál es el nombre del rey que pidió que se escribieran los Salmos?",
        options: ["David", "Salomón", "Ezequías"],
        answer: "A"
    },
    {
        question: "¿En qué libro de la Biblia se describe la creación del mundo?",
        options: ["Éxodo", "Génesis", "Levítico"],
        answer: "B"
    },
    {
        question: "¿Qué profeta desafió a los profetas de Baal en el monte Carmelo?",
        options: ["Isaías", "Elías", "Jeremías"],
        answer: "B"
    },
    {
        question: "¿Quién fue el último juez de Israel antes de que se estableciera la monarquía?",
        options: ["Samuel", "Débora", "Sansón"],
        answer: "A"
    },
    {
        question: "¿Qué rey ordenó la construcción del Templo de Jerusalén?",
        options: ["David", "Salomón", "Josías"],
        answer: "B"
    },
    {
        question: "¿En qué libro se menciona la visión del valle de los huesos secos?",
        options: ["Isaías", "Ezequiel", "Jeremías"],
        answer: "B"
    },
    {
        question: "¿Cómo se llama la madre de Samuel?",
        options: ["Ana", "Elcana", "Raquel"],
        answer: "A"
    },
    {
        question: "¿Qué apóstol negó conocer a Jesús tres veces antes del canto del gallo?",
        options: ["Pedro", "Juan", "Santiago"],
        answer: "A"
    },
    {
        question: "¿Quién fue el primer mártir cristiano?",
        options: ["Pedro", "Esteban", "Pablo"],
        answer: "B"
    },
    {
        question: "¿Cuántos libros componen el Antiguo Testamento?",
        options: ["39", "27", "66"],
        answer: "A"
    },
    {
        question: "¿Cuál es el último libro del Antiguo Testamento?",
        options: ["Malaquías", "Zacarías", "Isaías"],
        answer: "A"
    },
    {
        question: "¿Qué profeta fue tragado por un gran pez?",
        options: ["Isaías", "Jonás", "Elías"],
        answer: "B"
    },
    {
        question: "¿Quién fue el último rey de Judá antes de la caída de Jerusalén?",
        options: ["Zedequías", "Manasés", "Joaquín"],
        answer: "A"
    },
    {
        question: "¿Qué rey hizo que se fundieran los ídolos de oro durante el Éxodo?",
        options: ["David", "Salomón", "Aarón"],
        answer: "C"
    },
    {
        question: "¿Qué discípulo fue conocido como el 'discípulo amado'?",
        options: ["Pedro", "Juan", "Santiago"],
        answer: "B"
    },
    {
        question: "¿Qué mujer fue la madre de Samuel?",
        options: ["Ana", "Elcana", "Raquel"],
        answer: "A"
    },
    {
        question: "¿Qué libro de la Biblia contiene los Diez Mandamientos?",
        options: ["Éxodo", "Levítico", "Deuteronomio"],
        answer: "A"
    },
    {
        question: "¿Cuál es el nombre del profeta que desafió al rey Acab?",
        options: ["Isaías", "Elías", "Ezequiel"],
        answer: "B"
    },
    {
        question: "¿Qué apóstol fue conocido como el 'Doble de corazón'?",
        options: ["Tomás", "Mateo", "Andrés"],
        answer: "A"
    },
    {
        question: "¿Quién fue el rey de Israel que escribió muchos de los Proverbios?",
        options: ["David", "Salomón", "Ezequías"],
        answer: "B"
    },
    {
        question: "¿Qué rey tuvo una visión de una estatua con una cabeza de oro?",
        options: ["Nabucodonosor", "Ciro", "Darius"],
        answer: "A"
    },
    {
        question: "¿Cuál fue el nombre del líder de los israelitas que dividió el Mar Rojo?",
        options: ["Moisés", "Josué", "Abraham"],
        answer: "A"
    },
    {
        question: "¿Quién fue el profeta que confrontó a la reina Jezabel?",
        options: ["Elías", "Isaías", "Ezequiel"],
        answer: "A"
    },
    {
        question: "¿Cuál es el primer libro del Nuevo Testamento?",
        options: ["Mateo", "Marcos", "Lucas"],
        answer: "A"
    },
    {
        question: "¿Qué persona fue resucitada por Elías?",
        options: ["El hijo de la viuda de Sarepta", "El hijo de la viuda de Naín", "Lázaro"],
        answer: "A"
    },
    {
        question: "¿Qué profeta vivió en el vientre de un pez por tres días?",
        options: ["Jonás", "Elías", "Isaías"],
        answer: "A"
    },
    {
        question: "¿Quién fue el primer rey de Israel?",
        options: ["David", "Saúl", "Salomón"],
        answer: "B"
    },
    {
        question: "¿Qué apóstol escribió el libro de Apocalipsis?",
        options: ["Pedro", "Juan", "Santiago"],
        answer: "B"
    },
    {
        question: "¿En qué libro se encuentra la historia de la Torre de Babel?",
        options: ["Génesis", "Éxodo", "Levítico"],
        answer: "A"
    },
    {
        question: "¿Cuál es el nombre del árbol del que comió Eva?",
        options: ["El árbol de la vida", "El árbol del conocimiento del bien y del mal", "El árbol de la sabiduría"],
        answer: "B"
    },
    {
        question: "¿Quién fue el profeta que predijo la caída de Nínive?",
        options: ["Amós", "Jonás", "Isaías"],
        answer: "B"
    },
    {
        question: "¿Quién desarrolló la teoría de la relatividad?",
        options: ["Isaac Newton", "Nikola Tesla", "Albert Einstein"],
        answer: "C"
    },
    {
        question: "¿Qué molécula lleva la información genética?",
        options: ["ADN", "ARN", "Proteínas"],
        answer: "A"
    },
    {
        question: "¿Qué planeta es conocido como el 'Planeta Rojo'?",
        options: ["Júpiter", "Marte", "Saturno"],
        answer: "B"
    },
    {
        question: "¿Qué científico descubrió la ley de la gravedad?",
        options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei"],
        answer: "A"
    },
    {
        question: "¿Qué es el bosón de Higgs?",
        options: ["Una partícula subatómica", "Una ley física", "Un tipo de energía"],
        answer: "A"
    },
    {
        question: "¿Qué elemento químico tiene el símbolo 'O' en la tabla periódica?",
        options: ["Oxígeno", "Osmio", "Oro"],
        answer: "A"
    },
    {
        question: "¿Quién formuló la teoría de la evolución por selección natural?",
        options: ["Charles Darwin", "Jean-Baptiste Lamarck", "Gregor Mendel"],
        answer: "A"
    },
    {
        question: "¿Qué fenómeno explica la expansión del universo?",
        options: ["Teoría de la relatividad", "Teoría del Big Bang", "Teoría cuántica"],
        answer: "B"
    },
    {
        question: "¿Qué tipo de célula es responsable de la fotosíntesis en las plantas?",
        options: ["Células epiteliales", "Células musculares", "Células vegetales"],
        answer: "C"
    },
    {
        question: "¿Cuál es la unidad básica de la vida?",
        options: ["El átomo", "La célula", "El órgano"],
        answer: "B"
    },
    {
        question: "¿Qué gas es más abundante en la atmósfera terrestre?",
        options: ["Oxígeno", "Nitrógeno", "Dióxido de carbono"],
        answer: "B"
    },
    {
        question: "¿En qué parte de la célula se lleva a cabo la respiración celular?",
        options: ["El núcleo", "Las mitocondrias", "El citoplasma"],
        answer: "B"
    },
    {
        question: "¿Cómo se llama el proceso por el cual las plantas convierten la luz solar en energía?",
        options: ["Fermentación", "Respiración", "Fotosíntesis"],
        answer: "C"
    },
    {
        question: "¿Qué modelo astronómico describe a la Tierra como el centro del universo?",
        options: ["Modelo heliocéntrico", "Modelo geocéntrico", "Modelo de la relatividad"],
        answer: "B"
    },
    {
        question: "¿Qué es la teoría de cuerdas?",
        options: ["Una teoría sobre el origen del universo", "Una teoría sobre las partículas subatómicas", "Una teoría sobre la gravedad"],
        answer: "B"
    },
    {
        question: "¿Qué planeta tiene los anillos más conocidos?",
        options: ["Júpiter", "Saturno", "Urano"],
        answer: "B"
    },
    {
        question: "¿Quién descubrió la estructura del ADN?",
        options: ["James Watson y Francis Crick", "Louis Pasteur", "Marie Curie"],
        answer: "A"
    },
    {
        question: "¿Qué es la teoría de la relatividad general?",
        options: ["Una teoría de la gravedad", "Una teoría del origen del universo", "Una teoría sobre las partículas subatómicas"],
        answer: "A"
    },
    {
        question: "¿Qué es un agujero negro?",
        options: ["Un fenómeno que absorbe todo a su alrededor", "Una estrella moribunda", "Una nube de gas y polvo"],
        answer: "A"
    },
    {
        question: "¿En qué parte del átomo se encuentran los protones y neutrones?",
        options: ["En la corteza", "En el núcleo", "En los electrones"],
        answer: "B"
    },
    {
        question: "¿Qué científico descubrió la penicilina?",
        options: ["Alexander Fleming", "Louis Pasteur", "Marie Curie"],
        answer: "A"
    },
    {
        question: "¿Cómo se llama el proceso que transforma el agua en vapor?",
        options: ["Condensación", "Evaporación", "Fusión"],
        answer: "B"
    },
    {
        question: "¿Qué es un quark?",
        options: ["Una partícula subatómica", "Una teoría sobre el origen del universo", "Un tipo de energía"],
        answer: "A"
    },
    {
        question: "¿Cuál es el principal componente de las estrellas?",
        options: ["Hidrógeno", "Oxígeno", "Helio"],
        answer: "A"
    },
    {
        question: "¿Qué es el bosón de Higgs también conocido como 'la partícula de Dios'?",
        options: ["Una partícula subatómica", "Un tipo de energía", "Una ley física"],
        answer: "A"
    },
    {
        question: "¿Qué es la antimateria?",
        options: ["Materia que tiene propiedades opuestas a las partículas comunes", "Un tipo de materia desconocida", "Energía que se utiliza en la física cuántica"],
        answer: "A"
    },
    {
        question: "¿Qué significa el término 'fisión nuclear'?",
        options: ["La división de un átomo en partículas más pequeñas", "La fusión de dos átomos en uno", "La liberación de energía de los átomos"],
        answer: "A"
    },
    {
        question: "¿Qué es un solsticio?",
        options: ["El momento en que el Sol está más cerca de la Tierra", "El momento en que la Tierra está más alejada del Sol", "El momento en que la inclinación del eje de la Tierra es máxima"],
        answer: "C"
    },
    {
        question: "¿Qué es la ley de la conservación de la masa?",
        options: ["La masa total en un sistema cerrado permanece constante", "La masa total de un objeto siempre aumenta", "La masa siempre disminuye durante una reacción química"],
        answer: "A"
    },
    {
        question: "¿Qué elemento es conocido como el 'gas noble' por su estabilidad?",
        options: ["Helio", "Neón", "Xenón"],
        answer: "A"
    },
    {
        question: "¿Cuál es el principio que sostiene que los átomos no pueden ser creados ni destruidos?",
        options: ["Ley de la conservación de la masa", "Ley de la gravedad", "Teoría de la relatividad"],
        answer: "A"
    },
    {
        question: "¿Quién fue el emperador romano que dividió el Imperio Romano en dos partes?",
        options: ["Constantino I", "Diocleciano", "Teodosio I"],
        answer: "B"
    },
    {
        question: "¿Qué civilización desarrolló el calendario maya?",
        options: ["Azteca", "Inca", "Maya"],
        answer: "C"
    },
    {
        question: "¿Cuál es el nombre de la primera mujer que ganó un Premio Nobel?",
        options: ["Marie Curie", "Dorothy Hodgkin", "Rosalind Franklin"],
        answer: "A"
    },
    {
        question: "¿Qué obra filosófica fue escrita por Immanuel Kant?",
        options: ["Crítica de la razón pura", "Así habló Zaratustra", "El contrato social"],
        answer: "A"
    },
    {
        question: "¿Qué rey francés fue conocido como 'El Sol'?",
        options: ["Luis XIV", "Luis XVI", "Carlos I"],
        answer: "A"
    },
    {
        question: "¿Qué matemático griego es conocido por su teorema sobre los triángulos rectángulos?",
        options: ["Pitágoras", "Euclides", "Arquímedes"],
        answer: "A"
    },
    {
        question: "¿Quién fue el autor de la famosa obra 'La República'?",
        options: ["Platón", "Aristóteles", "Sócrates"],
        answer: "A"
    },
    {
        question: "¿En qué batalla se produjo la derrota de Napoleón Bonaparte en 1815?",
        options: ["Batalla de Leipzig", "Batalla de Waterloo", "Batalla de Austerlitz"],
        answer: "B"
    },
    {
        question: "¿Qué escritor británico es conocido por su obra '1984'?",
        options: ["Aldous Huxley", "George Orwell", "William Blake"],
        answer: "B"
    },
    {
        question: "¿Qué científico es conocido por su teoría sobre los agujeros negros?",
        options: ["Albert Einstein", "Stephen Hawking", "Isaac Newton"],
        answer: "B"
    },
    {
        question: "¿En qué guerra se enfrentaron los Estados Unidos y Vietnam?",
        options: ["Guerra de Vietnam", "Guerra Fría", "Guerra de Corea"],
        answer: "A"
    },
    {
        question: "¿Qué elemento químico tiene el símbolo 'W' en la tabla periódica?",
        options: ["Tungsteno", "Wolframio", "Wolfram"],
        answer: "A"
    },
    {
        question: "¿Qué filósofo griego fundó la escuela de filosofía llamada 'Academia'?",
        options: ["Platón", "Aristóteles", "Sócrates"],
        answer: "A"
    },
    {
        question: "¿Cuál es la obra más famosa de Miguel de Cervantes?",
        options: ["Don Quijote de la Mancha", "La Galatea", "Los trabajos de Persiles y Sigismunda"],
        answer: "A"
    },
    {
        question: "¿Qué civilización antigua construyó las pirámides de Giza?",
        options: ["Griega", "Egipcia", "Romana"],
        answer: "B"
    },
    {
        question: "¿Quién fue el primer ser humano en viajar al espacio?",
        options: ["Yuri Gagarin", "Alan Shepard", "John Glenn"],
        answer: "A"
    },
    {
        question: "¿En qué año ocurrió la caída del Muro de Berlín?",
        options: ["1987", "1989", "1991"],
        answer: "B"
    },
    {
        question: "¿Qué escritor estadounidense es conocido por su obra 'Matar a un ruiseñor'?",
        options: ["Harper Lee", "J.K. Rowling", "F. Scott Fitzgerald"],
        answer: "A"
    },
    {
        question: "¿Qué antiguo imperio abarcó gran parte del Medio Oriente, Asia Central y partes de Europa?",
        options: ["Imperio Mongol", "Imperio Persa", "Imperio Otomano"],
        answer: "A"
    },
    {
        question: "¿Qué científico es conocido por sus leyes del movimiento planetario?",
        options: ["Johannes Kepler", "Galileo Galilei", "Isaac Newton"],
        answer: "A"
    },
    {
        question: "¿Qué antigua ciudad fue conocida como la 'Ciudad de los Césares'?",
        options: ["Roma", "Atenas", "Constantinopla"],
        answer: "C"
    },
    {
        question: "¿Cuál es el color del sol?",
        options: ["Amarillo", "Verde", "Rojo"],
        answer: "A"
    },
    {
        question: "¿En qué continente se encuentra Brasil?",
        options: ["Asia", "Europa", "América"],
        answer: "C"
    },
    {
        question: "¿Quién pintó la Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci"],
        answer: "C"
    },
    {
        question: "¿Cuántos días tiene un año?",
        options: ["365", "366", "364"],
        answer: "A"
    },
    {
        question: "¿Cuál es el animal más grande del mundo?",
        options: ["Elefante", "Ballena azul", "Rinoceronte"],
        answer: "B"
    },
    {
        question: "¿Qué deporte se juega con una pelota redonda?",
        options: ["Béisbol", "Fútbol", "Tenis"],
        answer: "B"
    },
    {
        question: "¿Quién es el actual presidente de los Estados Unidos? (2023)",
        options: ["Donald Trump", "Joe Biden", "Barack Obama"],
        answer: "B"
    },
    {
        question: "¿En qué mes se celebra el Día de la Madre en la mayoría de los países?",
        options: ["Mayo", "Abril", "Junio"],
        answer: "A"
    },
    {
        question: "¿Cómo se llama el personaje principal de la película 'Frozen'?",
        options: ["Elsa", "Anna", "Rapunzel"],
        answer: "A"
    },
    {
        question: "¿Cuál es el idioma oficial de Brasil?",
        options: ["Español", "Portugués", "Inglés"],
        answer: "B"
    },
    {
        question: "¿Cuál es la capital de Francia?",
        options: ["Londres", "Roma", "París"],
        answer: "C"
    },
    {
        question: "¿Cuántos continentes hay en el mundo?",
        options: ["5", "6", "7"],
        answer: "C"
    },
    {
        question: "¿Cuál es el nombre del primer planeta del sistema solar?",
        options: ["Venus", "Mercurio", "Marte"],
        answer: "B"
    },
    {
        question: "¿En qué ciudad se encuentra la Torre Eiffel?",
        options: ["Roma", "París", "Londres"],
        answer: "B"
    },
    {
        question: "¿Qué animal es conocido por su lentitud y su caparazón?",
        options: ["Conejo", "Tortuga", "Perro"],
        answer: "B"
    },
    {
        question: "¿En qué año comenzó la Primera Guerra Mundial?",
        options: ["1912", "1914", "1916"],
        answer: "B"
    },
    {
        question: "¿Cuál es la capital de Australia?",
        options: ["Sídney", "Melbourne", "Canberra"],
        answer: "C"
    },
    {
        question: "¿Qué autor escribió la novela 'Matar a un ruiseñor'?",
        options: ["Harper Lee", "J.K. Rowling", "F. Scott Fitzgerald"],
        answer: "A"
    },
    {
        question: "¿Cuál es el animal terrestre más grande?",
        options: ["Elefante africano", "Rinoceronte blanco", "Oso polar"],
        answer: "A"
    },
    {
        question: "¿En qué continente se encuentra el desierto del Sahara?",
        options: ["Asia", "África", "América"],
        answer: "B"
    },
    {
        question: "¿Quién pintó la famosa obra 'La noche estrellada'?",
        options: ["Pablo Picasso", "Vincent van Gogh", "Claude Monet"],
        answer: "B"
    },
    {
        question: "¿Qué nombre recibe el aparato que mide la temperatura?",
        options: ["Termómetro", "Barómetro", "Higrómetro"],
        answer: "A"
    },
    {
        question: "¿Qué país tiene la mayor población del mundo?",
        options: ["India", "China", "Estados Unidos"],
        answer: "B"
    },
    {
        question: "¿Quién fue el primer hombre en caminar sobre la Luna?",
        options: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin"],
        answer: "B"
    },
    {
        question: "¿Cuál es el río más largo del mundo?",
        options: ["Nilo", "Amazonas", "Yangtsé"],
        answer: "A"
    },
    {
        question: "¿En qué año terminó la Segunda Guerra Mundial?",
        options: ["1945", "1950", "1960"],
        answer: "A"
    },
    {
        question: "¿Quién es el creador de la teoría de la evolución?",
        options: ["Albert Einstein", "Isaac Newton", "Charles Darwin"],
        answer: "C"
    },
    {
        question: "¿Cómo se llama el continente que está completamente cubierto por hielo?",
        options: ["Antártida", "Asia", "África"],
        answer: "A"
    },
    {
        question: "¿Cuál es el símbolo químico del oro?",
        options: ["Ag", "Au", "O"],
        answer: "B"
    },
    {
        question: "¿Qué significa la sigla 'ONU'?",
        options: ["Organización Nacional Unida", "Organización de Naciones Unidas", "Organización para la Unidad de Naciones"],
        answer: "B"
    },
    {
        question: "¿Cuál es la capital de España?",
        options: ["Barcelona", "Madrid", "Sevilla"],
        an