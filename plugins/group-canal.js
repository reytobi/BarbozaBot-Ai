
var handler = async (m, { command }) => {
    if (command === 'canal') {
        const canalLink = 'tu_enlace_de_canal_aqui'; // Reemplaza esto con tu enlace
        conn.reply(m.chat, `Aquí está el enlace de mi canal: ${canalLink}`, m);
    }
};