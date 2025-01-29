 
const annualReward = { 
    coin: 1000, 
    exp: 5000, 
    diamond: 50, 
}; 
const oneYearMs = 31536000000; // Miliseconds in a year (more precise) 
var handler = async (m, { conn, text }) =&gt; { 
    let user = global.db.data.users[m.sender]; 
    //More robust user handling: creates a default user if none exists 
    if (!user) { 
        user = global.db.data.users[m.sender] = { 
            coin: 0, 
            diamond: 0, 
            exp: 0, 
            lastAnnualClaim: 0, 
        }; 
    } 
<pre><code>const lastClaim = user.lastAnnualClaim || 0; 
const currentTime = Date.now(); 
 
if (currentTime - lastClaim &lt; oneYearMs) { 
    const remainingTime = msToTime(oneYearMs - (currentTime - lastClaim)); 
    return conn.reply(m.chat, `🕚 *Ya has reclamado tu recompensa anual. Vuelve en ${remainingTime}*`, m); 
} 
 
// Update rewards using destructuring for conciseness and better readability 
user.coin += annualReward.coin; 
user.diamond += annualReward.diamond; 
user.exp += annualReward.exp; 
user.lastAnnualClaim = currentTime; 
 
 
// Safer way to handle potential undefined 'moneda' 
const moneda = global.moneda ?? 'Moneda'; 
 
conn.reply(m.chat, `🎉 *Recompensa Anual Reclamada* 
``` 
Recursos: 
💸 ${moneda}: &lt;em&gt;+${annualReward.coin}&lt;/em&gt; 
💎 Diamantes: &lt;em&gt;+${annualReward.diamond}&lt;/em&gt; 
✨ XP: &lt;em&gt;+${annualReward.exp}&lt;/em&gt;`, m); 
``` 
}; 
handler.help = ['annual', 'yearly']; 
handler.tags = ['rpg']; 
handler.command = ['annual', 'yearly']; 
handler.register = true; 
export default handler; 
function msToTime(duration) { 
    const seconds = Math.floor((duration / 1000) % 60); 
    const minutes = Math.floor((duration / (1000 * 60)) % 60); 
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24); 
    const days = Math.floor(duration / (1000 * 60 * 60 * 24)); 
<pre><code>return `${days} Día${days !== 1 ? 's' : ''} ${hours} Hora${hours !== 1 ? 's' : ''} ${minutes} Minuto${minutes !== 1 ? 's' : ''} ${seconds} Segundo${seconds !== 1 ? 's' : ''}`; 