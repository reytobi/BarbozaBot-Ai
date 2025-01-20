global.math = global.math ? global.math : {};

const fs = require('fs'); // Asegúrate de importar fs si no está hecho

const handler = async (m, {conn, args, usedPrefix, command}) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje;
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  const tradutor = _translate.plugins.juegos_matemicas?.texto1 ? _translate.plugins.juegos_matemicas : _translate.plugins.juegos_matematicas;

  const mat = `${tradutor.texto1} _${usedPrefix + command} medium_\n\n${tradutor.texto2} ${Object.keys(modes).join(' | ')}`.trim();
  if (args.length < 1) return await conn.reply(m.chat, mat, m);

  const mode = args[0].toLowerCase();
  if (!(mode in modes)) return await conn.reply(m.chat, mat, m);

  const id = m.chat;
  if (id in global.math) return conn.reply(m.chat, tradutor.texto3, global.math[id][0]);

  const math = genMath(mode);
  global.math[id] = [
    await conn.reply(m.chat, `${tradutor.texto4[0]} ${math.str}\n\n${tradutor.texto4[1]} ${(math.time / 1000).toFixed(2)}s\n\n${tradutor.texto4[2]} ${math.bonus} XP\n\njrU022n8Vf`, m),
    math,
    4,
    setTimeout(() => {
      if (global.math[id]) {
        conn.reply(m.chat, `${tradutor.texto5} ${math.result}`, m);
        delete global.math[id];
      }
    }, math.time),
  ];
};

handler.command = /^math|mates|matemáticas/i;
export default handler;

const modes = {
  noob: [-3, 3, -3, 3, '+-', 15000, 10],
  easy: [-10, 10, -10, 10, '*/+-', 20000, 40],
  medium: [-40, 40, -20, 20, '*/+-', 40000, 150],
  hard: [-100, 100, -70, 70, '*/+-', 60000, 350],
  extreme: [-999999, 999999, -999999, 999999, '*/', 99999, 9999],
  impossible: [-99999999999, 99999999999, -99999999999, 999999999999, '*/', 30000, 35000],
  impossible2: [-999999999999999, 999999999999999, -999, 999, '/', 30000, 50000],
};

const operators = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷',
};

function genMath(mode) {
  const [a1, a2, b1, b2, ops, time, bonus] = modes[mode];
  let a = randomInt(a1, a2);
  const b = randomInt(b1, b2);
  const op = pickRandom([...ops]);
  let result = (new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b}`))();
  if (op === '/') [a, result] = [result, a];
  return {
    str: `${a} ${operators[op]} ${b}`,
    mode,
    time,
    bonus,
    result,
  };
}

function randomInt(from, to) {
  if (from > to) [from, to] = [to, from];
  from = Math.floor(from);
  to = Math.floor(to);
  return Math.floor((to - from) * Math.random() + from);
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}