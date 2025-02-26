
let handler = async (m, { isPrems, conn }) => {
    let time = global.db.data.users[m.sender].lastcofre + 36000000; // 10 horas
    if (new Date() - global.db.data.users[m.sender].lastcofre < 0) {
        throw [❗𝐈𝐍𝐅𝐎❗] 𝚈𝙰 𝚁𝙴𝙲𝙻𝙰𝙼𝙰𝚜𝚝𝙴 𝚃𝚄 𝙲𝙾𝙵𝚁𝙴\𝚗𝚅𝚄𝙴𝙻𝚅𝙴 𝙴𝙽 *${msToTime(time - new Date())}* 𝙿𝙰𝚁𝙰 𝚅𝙾𝙻𝚅𝙴𝚁 𝐴  ℝ𝐸𝐶𝐿𝐴𝐌𝐴ℝ;
    }

    let img = 'https://telegra.ph/file/daf0bc0fc3c1e4c471c5c.jpg'; 
    let texto = '📕 ¡LA #AGENDASEMANAL ESTÁ AQUÍ! 📕\n\n📢 Abran paso al REY 👑 Pelea por la corona con una nueva barba para tomar el trono del emote Máquina del Tesoro Imperial.\n\n🔨 También adueñarte del Whac-A-Mole y no olvides comer frutas y verduras con el regreso de una MP5 peligrosa. 🐰🥕\n\n¿Listo para reinar Bermuda? \n#CelebraciónDePascua';

    const fkontak = {
        "key": {
            "participants": "0@s.whatsapp.net",
            "remoteJid": "status@broadcast",
            "fromMe": false,
            "id": "Halo"
        },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    };

    await conn.sendFile(m.chat, img, 'img.jpg', texto, fkontak);
    global.db.data.users[m.sender].lastcofre = new Date().getTime();
};

handler.command = ['agendasemanal']; 
handler.register = false; 
export default handler;