
const handler = async (m) => {
    if (m.text.startsWith('.mamaguevo') || m.text.startsWith('.mmgvo')) {
        const usuario = m.sender; // Obtener el identificador del usuario

        // Mensaje a enviar
        const mensaje = `💫 *CALCULADORA*\n\n💅🏻 Los cálculos han arrojado que @${usuario} es *%* mmgvo 🏳️‍🌈\n> ✰ La Propia Puta Mamando!\n\n➤ ¡Sorpresa!`;

        return m.reply(mensaje);
    }
};

handler.command = /^(mamaguevo|mmgvo)$/i;
export default handler;