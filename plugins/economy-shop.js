
let handler = async (m, { conn, args }) => {
   // Define el costo de un dulce en XP
   const costPerCandy = 10; // Cambia este valor según lo que desees

   // Verifica si se proporcionó la cantidad de dulces a comprar
   let amount = parseInt(args[0]);
   if (isNaN(amount) || amount <= 0) {
      return conn.reply(m.chat, 'Por favor, proporciona una cantidad válida de dulces a comprar.', m);
   }

   // Obtén la información del usuario
   let user = global.db.data.users[m.sender];

   // Calcula el costo total en XP
   let totalCost = costPerCandy * amount;

   // Verifica si el usuario tiene suficiente XP
   if (user.exp < totalCost) {
      return conn.reply(m.chat, `No tienes suficiente experiencia. Necesitas *${totalCost} XP* para comprar *${amount} dulces*.`, m);
   }

   // Resta la experiencia y suma los dulces
   user.exp -= totalCost;
   user.limit += amount; // Asumiendo que 'limit' representa la cantidad de dulces

   await m.reply(`¡Has comprado *${amount}* 🍬 Dulces! Ahora tienes *${user.limit}* 🍬 y *${user.exp} XP* restantes.`);
}

handler.help = ['buy <cantidad>'];
handler.tags = ['rpg'];
handler.command = ['buy'];
handler.register = true;
export default handler;