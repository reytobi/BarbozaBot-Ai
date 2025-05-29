import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile, existsSync, mkdirSync } from 'fs';
import cfonts from 'cfonts';
import { createInterface } from 'readline';
import yargs from 'yargs';
import chalk from 'chalk';
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { name, description, author, version } = require(join(__dirname, './package.json'));
const { say } = cfonts;
const rl = createInterface(process.stdin, process.stdout);

function verify() {
let jadi = 'Sesiones/Subbots'
let Sesion = 'Sesiones/Principal'
  const cps = [
   'tmp',
    jadi,
    Sesion
  ];
  for (const cpss of cps) {
    if (typeof cpss === 'string' && cpss.trim() !== '') {
      if (!existsSync(cpss)) {
        mkdirSync(`./${cpss}`, { recursive: true });
      }
    } else {
      console.warn('Ruta inválida o no definida:', cpss);
    }
  }
}
verify();

say('Barboza - Bot', {
font: 'chrome',
align: 'center',
colors: ['white']
});
say(`Developed By • Barboza Ai`, {
font: 'console',
align: 'center',
colors: ['magenta']
});
var isRunning = false;
function start(file) {
if (isRunning) return;
isRunning = true;
let args = [join(__dirname, file), ...process.argv.slice(2)];

setupMaster({
exec: args[0],
args: args.slice(1),
});
let p = fork();
p.on('message', data => {
switch (data) {
case 'reset':
p.process.kill();
isRunning = false;
start.apply(this, arguments);
break;
case 'uptime':
p.send(process.uptime());
break;
}
});
p.on('exit', (_, code) => {
isRunning = false;
console.error('🚩 Error :\n', code);
process.exit();
if (code === 0) return;
watchFile(args[0], () => {
unwatchFile(args[0]);
start(file);
});
});
let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
if (!opts['test'])
if (!rl.listenerCount()) rl.on('line', line => {
p.emit('message', line.trim());
});
}
process.on('warning', (warning) => {
if (warning.name === 'MaxListenersExceededWarning') {
console.warn('🚩 Se excedió el límite de Listeners en :');
console.warn(warning.stack);
}
});
start('main.js');