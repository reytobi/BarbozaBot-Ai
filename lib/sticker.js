import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { ffmpeg } from './converter.js'; // Asegúrate de que 'converter.js' existe y exporta 'ffmpeg'
import fluent_ffmpeg from 'fluent-ffmpeg';
import { spawn } from 'child_process';
import { fileTypeFromBuffer } from 'file-type';
import webp from 'node-webpmux';
import fetch from 'node-fetch';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tmp = path.join(__dirname, '../tmp');

/**
 * Convierte una imagen a un sticker WebP usando ffmpeg y ImageMagick/GraphicsMagick.
 * @param {Buffer} img Buffer de la imagen.
 * @param {String} url URL de la imagen.
 * @returns {Promise<Buffer>} Promesa que resuelve con el buffer del sticker WebP.
 */
function sticker2(img, url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (url) {
        const res = await fetch(url);
        if (res.status !== 200) throw new Error(`Error al descargar la imagen de la URL: ${res.status} ${await res.text()}`);
        img = await res.buffer();
      }

      const inputPath = path.join(tmp, `${+new Date()}.jpeg`);
      await fs.promises.writeFile(inputPath, img);

      // Proceso FFmpeg para redimensionar y convertir a PNG
      const ffmpegProcess = spawn('ffmpeg', [
        '-y',                 // Sobreescribir archivo de salida si existe
        '-i', inputPath,      // Archivo de entrada
        '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1',
        '-f', 'png',          // Formato de salida PNG
        '-'                   // Salida a stdout
      ]);

      ffmpegProcess.on('error', (err) => {
        fs.promises.unlink(inputPath).catch(console.error); // Limpiar archivo de entrada
        reject(new Error(`Error en FFmpeg: ${err.message}`));
      });
      ffmpegProcess.on('close', async (code) => {
        if (code !== 0) {
          // Si FFmpeg falla, asegúrate de que el archivo temporal sea eliminado y rechaza la promesa.
          fs.promises.unlink(inputPath).catch(console.error);
          return reject(new Error(`FFmpeg exited with code ${code}`));
        }
        await fs.promises.unlink(inputPath).catch(console.error); // Limpiar archivo de entrada después de un cierre exitoso
      });

      const imageMagickArgs = [];
      let command = '';

      if (support.gm) { // Usar GraphicsMagick si está disponible
        command = 'gm';
        imageMagickArgs.push('convert', 'png:-', 'webp:-');
      } else if (support.magick) { // Usar ImageMagick (magick) si está disponible
        command = 'magick';
        imageMagickArgs.push('convert', 'png:-', 'webp:-');
      } else if (support.convert) { // Usar ImageMagick (convert) si está disponible
        command = 'convert';
        imageMagickArgs.push('png:-', 'webp:-');
      } else {
        await fs.promises.unlink(inputPath).catch(console.error);
        return reject(new Error('No se encontró GraphicsMagick o ImageMagick (gm, magick, convert).'));
      }

      const buffers = [];
      const imageMagickProcess = spawn(command, imageMagickArgs);

      imageMagickProcess.on('error', (err) => {
        fs.promises.unlink(inputPath).catch(console.error); // Limpiar si hubo un error en FFmpeg antes de IM
        reject(new Error(`Error en ImageMagick/GraphicsMagick: ${err.message}`));
      });

      imageMagickProcess.stdout.on('data', (chunk) => buffers.push(chunk));
      ffmpegProcess.stdout.pipe(imageMagickProcess.stdin); // Canaliza la salida de FFmpeg a la entrada de ImageMagick

      imageMagickProcess.on('exit', (code) => {
        if (code !== 0) {
          return reject(new Error(`ImageMagick/GraphicsMagick exited with code ${code}`));
        }
        resolve(Buffer.concat(buffers));
      });

    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Envía código JavaScript a un servicio de canvas externo para renderizar una imagen.
 * @param {String} code Código JavaScript a ejecutar en el canvas.
 * @param {String} [type='png'] Tipo de imagen de salida (e.g., 'png', 'webp').
 * @param {Number} [quality=0.92] Calidad de la imagen (0.0 a 1.0).
 * @returns {Promise<Buffer>} Promesa que resuelve con el buffer de la imagen.
 */
async function canvas(code, type = 'png', quality = 0.92) {
  const res = await fetch('https://nurutomo.herokuapp.com/api/canvas?' + queryURL({
    type,
    quality
  }), {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': code.length
    },
    body: code
  });
  if (!res.ok) {
    throw new Error(`API de Canvas falló con estado ${res.status}: ${await res.text()}`);
  }
  return await res.buffer();
}

/**
 * Convierte un objeto de consultas en una cadena de consulta URL.
 * @param {Object} queries Objeto con las consultas.
 * @returns {URLSearchParams} Objeto URLSearchParams.
 */
function queryURL(queries) {
  return new URLSearchParams(Object.entries(queries));
}

/**
 * Convierte una imagen a un sticker WebP usando un servicio de canvas externo.
 * @param {Buffer} img Buffer de la imagen.
 * @param {String} url URL de la imagen.
 * @returns {Promise<Buffer>} Promesa que resuelve con el buffer del sticker WebP.
 */
async function sticker1(img, url) {
  // NOTA: La función 'uploadImage' no está definida en este archivo.
  // Debes asegurarte de que 'uploadImage' esté disponible globalmente o importarla.
  // Por ahora, se asume que 'url' ya está disponible o se manejará externamente.
  url = url ? url : /* await uploadImage(img) */ null; // Comentado por no estar definida 'uploadImage'

  if (!url && !img) {
      throw new Error('Se requiere un buffer de imagen o una URL.');
  }

  const fileInfo = url ? { mime: 'image/jpeg' } : await fileTypeFromBuffer(img);
  if (!fileInfo || !fileInfo.mime) {
      throw new Error('No se pudo determinar el tipo de archivo de la imagen.');
  }

  const imageUrl = url ? `await window.loadToDataURI('${url}')` : `await new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(new Blob([${JSON.stringify(Array.from(img))}]));
  })`;

  // Script de canvas para dibujar la imagen
  const canvasScript = `
    let im = await loadImg('data:${fileInfo.mime};base64,'+(${url ? `await window.loadToDataURI('${url}')` : `await new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Solo la parte base64
      reader.readAsDataURL(new Blob([new Uint8Array(${JSON.stringify(Array.from(img))})], {type: '${fileInfo.mime}'}));
    })`}))
    c.width = c.height = 512
    let max = Math.max(im.width, im.height)
    let w = 512 * im.width / max
    let h = 512 * im.height / max
    ctx.drawImage(im, 256 - w / 2, 256 - h / 2, w, h)
  `;
  return await canvas(canvasScript, 'webp');
}


/**
 * Convierte una imagen o video a un sticker WebP usando ffmpeg.
 * @param {Buffer} img Buffer de la imagen/video.
 * @param {String} url URL de la imagen/video.
 * @returns {Promise<Buffer>} Promesa que resuelve con el buffer del sticker WebP.
 */
async function sticker4(img, url) {
  if (url) {
    const res = await fetch(url);
    if (res.status !== 200) throw new Error(`Error al descargar el recurso de la URL: ${res.status} ${await res.text()}`);
    img = await res.buffer();
  }
  if (!img) {
    throw new Error('No se proporcionó buffer de imagen/video ni URL.');
  }
  return await ffmpeg(img, [
    '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
  ], 'jpeg', 'webp'); // 'jpeg' es el formato de entrada esperado por ffmpeg
}

/**
 * Convierte una imagen o video a un sticker WebP usando 'wa-sticker-formatter'.
 * @param {Buffer} img Buffer de la imagen/video.
 * @param {String} url URL de la imagen/video.
 * @param {String} packname Nombre del paquete del sticker.
 * @param {String} author Autor del sticker.
 * @param {String[]} [categories=['']] Categorías de emojis para el sticker.
 * @param {Object} [extra={}] Datos extra para los metadatos del sticker.
 * @returns {Promise<Buffer>} Promesa que resuelve con el buffer del sticker WebP.
 */
async function sticker5(img, url, packname, author, categories = [''], extra = {}) {
  const { Sticker } = await import('wa-sticker-formatter');
  const stickerMetadata = {
    type: 'default',
    pack: packname,
    author,
    categories,
    ...extra
  };
  return (new Sticker(img || url, stickerMetadata)).toBuffer(); // Utiliza img si existe, de lo contrario url
}

/**
 * Convierte una imagen o video a un sticker WebP usando fluent-ffmpeg.
 * @param {Buffer} img Buffer de la imagen/video.
 * @param {String} url URL de la imagen/video.
 * @returns {Promise<Buffer>} Promesa que resuelve con el buffer del sticker WebP.
 */
function sticker6(img, url) {
  return new Promise(async (resolve, reject) => {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) throw new Error(`Error al descargar el recurso de la URL: ${res.status} ${await res.text()}`);
      img = await res.buffer();
    }
    if (!img) {
      return reject(new Error('No se proporcionó buffer de imagen/video ni URL.'));
    }

    const type = await fileTypeFromBuffer(img) || {
      mime: 'application/octet-stream',
      ext: 'bin'
    };
    if (type.ext === 'bin' || !type.mime) {
      return reject(new Error('Tipo de archivo no reconocido o datos binarios.'));
    }

    const tempInputPath = path.join(tmp, `${+new Date()}.${type.ext}`);
    const outputPath = path.join(tmp, `${+new Date()}.webp`); // Nombre de salida único

    try {
      await fs.promises.writeFile(tempInputPath, img);

      let ffmpegProcess = /video/i.test(type.mime)
        ? fluent_ffmpeg(tempInputPath).inputFormat(type.ext)
        : fluent_ffmpeg(tempInputPath).input(tempInputPath);

      ffmpegProcess
        .on('error', function (err) {
          console.error('Error en fluent-ffmpeg:', err);
          fs.promises.unlink(tempInputPath).catch(console.error);
          fs.promises.unlink(outputPath).catch(console.error); // Asegurarse de limpiar la salida
          reject(new Error(`Error de procesamiento de ffmpeg: ${err.message}`));
        })
        .on('end', async function () {
          try {
            const resultBuffer = await fs.promises.readFile(outputPath);
            resolve(resultBuffer);
          } catch (readErr) {
            reject(new Error(`Error al leer el archivo de salida: ${readErr.message}`));
          } finally {
            // Asegurarse de que los archivos temporales se limpien
            fs.promises.unlink(tempInputPath).catch(console.error);
            fs.promises.unlink(outputPath).catch(console.error);
          }
        })
        .addOutputOptions([
          '-vcodec', 'libwebp',
          '-vf', "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse"
        ])
        .toFormat('webp')
        .save(outputPath);
    } catch (writeErr) {
      reject(new Error(`Error al escribir el archivo temporal: ${writeErr.message}`));
    }
  });
}

/**
 * Añade metadatos JSON de Exif para WhatsApp a un sticker WebP.
 * Basado en https://github.com/pedroslopez/whatsapp-web.js/pull/527/files
 * @param {Buffer} webpSticker Buffer del sticker WebP.
 * @param {String} packname Nombre del paquete del sticker.
 * @param {String} author Autor del sticker.
 * @param {String[]} [categories=['']] Array de emojis para el sticker.
 * @param {Object} [extra={}] Objeto con datos extra para los metadatos.
 * @returns {Promise<Buffer>} Promesa que resuelve con el buffer del sticker WebP con Exif.
 */
async function addExif(webpSticker, packname, author, categories = [''], extra = {}) {
  const img = new webp.Image();
  const stickerPackId = crypto.randomBytes(32).toString('hex');
  const json = {
    'sticker-pack-id': stickerPackId,
    'sticker-pack-name': packname,
    'sticker-pack-publisher': author,
    'emojis': categories,
    ...extra
  };
  let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
  let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
  let exif = Buffer.concat([exifAttr, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4); // Escribe la longitud del JSON en el offset 14 (4 bytes)
  await img.load(webpSticker);
  img.exif = exif;
  return await img.save(null);
}

/**
 * Convierte una imagen o video a un sticker WebP, intentando varios métodos.
 * Añade metadatos EXIF si la conversión es exitosa.
 * @param {Buffer} img Buffer de la imagen/video.
 * @param {String} url URL de la imagen/video.
 * @param {...String} args Argumentos adicionales (packname, author, categories, extra).
 * @returns {Promise<Buffer|Error>} Promesa que resuelve con el buffer del sticker WebP
 * o un objeto Error si todos los métodos fallan.
 */
async function sticker(img, url, ...args) {
  let lastError;
  let stiker;

  // Los métodos se prueban en orden de preferencia, asumiendo que sticker5 es la más robusta
  // y luego las que usan ffmpeg, y finalmente las que dependen de servicios externos o Imagemagick.
  const conversionFunctions = [
    support.ffmpeg && sticker6, // fluent-ffmpeg
    sticker5,                   // wa-sticker-formatter
    support.ffmpeg && support.ffmpegWebp && sticker4, // ffmpeg directo
    support.ffmpeg && (support.convert || support.magick || support.gm) && sticker2, // ffmpeg + imagemagick/graphicsmagick
    sticker1                    // Servicio de canvas externo
  ].filter(f => f); // Filtra funciones nulas (si las dependencias no están disponibles)

  for (let func of conversionFunctions) {
    try {
      stiker = await func(img, url, ...args);
      // wa-sticker-formatter ya devuelve un buffer de WebP directamente
      // Otras funciones también deberían devolver un buffer de WebP
      if (stiker instanceof Buffer && stiker.toString('hex', 0, 4) === '52494646') { // Riff header for WebP
        try {
          return await addExif(stiker, ...args);
        } catch (e) {
          console.error('Error al añadir EXIF, devolviendo sticker sin EXIF:', e);
          return stiker; // Devuelve el sticker sin EXIF si falla addExif
        }
      }
      // Si llega aquí y no es un buffer WebP válido, lanza un error para intentar el siguiente método
      throw new Error('La función de sticker devolvió un formato inesperado.');
    } catch (err) {
      lastError = err;
      console.error(`Método fallido: ${func.name || 'función anónima'} - Error:`, err);
      continue; // Intenta el siguiente método
    }
  }
  console.error('Todos los métodos de conversión de sticker fallaron. Último error:', lastError);
  return lastError instanceof Error ? lastError : new Error(`Fallo desconocido: ${lastError}`);
}

// Objeto que indica la disponibilidad de las herramientas necesarias
const support = {
  ffmpeg: true,     // ¿Está ffmpeg instalado?
  ffprobe: true,    // ¿Está ffprobe instalado (parte de ffmpeg)?
  ffmpegWebp: true, // ¿Puede ffmpeg generar WebP?
  convert: true,    // ¿Está ImageMagick 'convert' instalado?
  magick: false,    // ¿Está ImageMagick 'magick' instalado?
  gm: false,        // ¿Está GraphicsMagick 'gm' instalado?
  find: false       // (No se usa directamente en este código, pero puede ser una bandera para otras utilidades)
};

export {
  sticker,
  sticker1,
  sticker2,
  sticker4,
  sticker6,
  addExif,
  support
};
