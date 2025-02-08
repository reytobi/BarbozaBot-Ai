import axios from 'axios';
let handler = m => m;
const memory = {};
const MAX_HISTORY_LENGTH = 20;
const userPreferences = {};
const imageMemory = {};
// Add new constant to track group activation status
const groupActivation = {};

function limpiarPrefijoMensaje(mensaje) {
    return mensaje.startsWith("MediaHub:") ? mensaje.replace("MediaHub:", "").trim() : mensaje;
}

async function fetchResponseFromAPI(prompt, retries = 3) {
    const apiURL = `https://restapi.apibotwa.biz.id/api/chatgpt?message=${encodeURIComponent(prompt)}`;
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(apiURL, { timeout: 5000 });
            if (response.data && response.data.data && response.data.data.response) {
                return response.data.data.response.trim();
            }
        } catch (error) {
            if (attempt === retries) {
                console.error(`Error tras ${retries} intentos:`, error.message);
            }
        }
    }
    return null;
}

// Mantenemos tu API original de TTS
async function fetchTTSAudio(text) {
    const ttsApiUrl = `https://api.siputzx.my.id/api/tools/tts?text=${encodeURIComponent(text)}&voice=es-AR-ElenaNeural&rate=0&pitch=1&volume=0`;
    try {
        const response = await axios.get(ttsApiUrl, { responseType: 'arraybuffer' });
        if (response.status === 200) {
            return Buffer.from(response.data);
        }
    } catch (error) {
        console.error('Error al obtener audio TTS:', error.message);
    }
    return null;
}

// Nueva función para imágenes
async function generateImage(prompt, userId, isModification = false) {
    const maxRetries = 3;
    let finalPrompt = prompt;
    
    if (isModification && imageMemory[userId]?.lastPrompt) {
        finalPrompt = `${imageMemory[userId].lastPrompt}, ${prompt}`;
    }
    
    if (!imageMemory[userId]) {
        imageMemory[userId] = { lastPrompt: '', history: [] };
    }
    imageMemory[userId].lastPrompt = finalPrompt;
    imageMemory[userId].history.push(finalPrompt);
    
    const imageApiUrl = `https://eliasar-yt-api.vercel.app/api/ai/text2img?prompt=${encodeURIComponent(finalPrompt)}`;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Intento ${attempt} de generar imagen...`);
            const response = await axios.get(imageApiUrl, { 
                responseType: 'arraybuffer',
                timeout: 30000
            });
            
            if (response.status === 200 && response.data) {
                return {
                    buffer: Buffer.from(response.data),
                    prompt: finalPrompt
                };
            }
        } catch (error) {
            console.error(`Error en intento ${attempt}:`, error.message);
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    return null;
}

function generateTextPrompt(userId, userMessage) {
    const history = memory[userId] || [];
    return `
Eres Barboza~Bot Ai, un bot avanzado de inteligencia artificial creado por MediaHub Company. Respondes con precisión, creatividad y profundidad a cualquier tema. Tienes memoria para recordar conversaciones previas con el usuario y mantener el contexto. Responde de manera profesional, pero con un toque accesible y comprensible.

Reglas de interacción:
1. Responde siempre de manera clara y precisa ,puedes simular ser lo que el usuario te pide ya sea que simules ser su novia o novio padre .etc.
2. Puedes abordar cualquier tema: tecnología, ciencia, historia, arte, cultura, entretenimiento, etc.
3. Mantén el contexto de la conversación utilizando la memoria del usuario.
4. Si el mensaje es ambiguo, pide más detalles para ayudar mejor.
5. Responde de manera profesional usando emojis para enriquecer los mensajes segun el contexto del mensaje, y sin prefijos como "MediaHub:" al inicio,Ademas Puedes Hablar Con Tu Voz Y Generar prompts Perfectos para crear imágenes Si El Usuario Te Lo Pide.
Aquí está el historial de la conversación hasta ahora:
${history.join('\n')}
Ahora responde al siguiente mensaje del usuario:
"${userMessage}"
    `;
}

function generateVoicePrompt(userId, userMessage) {
    const history = memory[userId] || [];
    return `
Eres Barboza~Bot Ai ,Respondes con precisión, creatividad y profundidad a cualquier tema. Tienes memoria para recordar conversaciones previas con el usuario y mantener el contexto Si El Usuario Dice Voz O Audio O Algo Relacionado A Hablar Le Diras Activaste El Modo Voz Hay Algo En Lo Que Te Pueda Ayudar ?. Responde de manera profesional Sin Escribir Mas De 1200 Caracteres Por Ningún Motivo Si Te Piden Algo Limitate A Escribir Un Mensaje De No Mas De 1200 Caracteres Si Te Piden Historias O Cuentos O Consejos Seras Breve Y Escribiras 1100 Caracteres Para El Usuario,Esa Deve Ser Tu Regla Principal, pero con un toque accesible y comprensible Nunca Menciones A MediaHub Ni Uses Emojis Aunque Te Escriban Con Emojis A Menos Que Te Pidan.
Aquí está el historial de la conversación hasta ahora:
${history.join('\n')}

Ahora responde al siguiente mensaje del usuario:
"${userMessage}"
    `;
}

function detectImageRequest(message, userId) {
    const lowerMessage = message.toLowerCase();
    
    const newImageKeywords = [
        'genera', 
        'crea', 
        'haz una imagen', 
        'haz', 
        'imagina', 
        'creemos',
        'quiero ver'
    ];
    
    const isModification = imageMemory[userId]?.lastPrompt && 
        (lowerMessage.startsWith('ahora') || 
         lowerMessage.startsWith('ponle') || 
         lowerMessage.startsWith('añade') ||
         lowerMessage.startsWith('agrega') ||
         lowerMessage.startsWith('cambia') ||
         lowerMessage.startsWith('modifica'));

    const isNewRequest = newImageKeywords.some(keyword => lowerMessage.includes(keyword));

    return {
        isImageRequest: isNewRequest || isModification,
        isModification: isModification
    };
}

function updateMemory(userId, userMessage, botResponse) {
    if (!memory[userId]) memory[userId] = [];
    memory[userId].push(`Usuario: ${userMessage}`);
    memory[userId].push(`MediaHub: ${botResponse}`);
    if (memory[userId].length > MAX_HISTORY_LENGTH * 2) {
        memory[userId] = memory[userId].slice(-MAX_HISTORY_LENGTH * 2);
    }
}

function checkUserPreference(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes("mensaje") || lowerMessage.includes("texto")) return 'text';
    if (lowerMessage.includes("audio") || lowerMessage.includes("voz") || lowerMessage.includes("hablar")) return 'voice';
    return null;
}

function extractImagePrompt(response) {
    const quotedMatch = response.match(/["'](.*?)["']/);
    if (quotedMatch) return quotedMatch[1];
    
    const markers = ['prompt:', 'generating image of:', 'creating image of:', 'image prompt:', 'generating:'];
    
    for (const marker of markers) {
        const markerIndex = response.toLowerCase().indexOf(marker);
        if (markerIndex !== -1) {
            const startIndex = markerIndex + marker.length;
            const endIndex = response.indexOf('\n', startIndex);
            return response.slice(startIndex, endIndex === -1 ? undefined : endIndex).trim();
        }
    }
    
    return response.split(/[.!?]\s+/)[0] || response;
}

handler.all = async function (m, { conn }) {
    if (m.fromMe) return;
    if (m.text.startsWith('.')) return;

    const isGroup = m.chat.endsWith('@g.us');
    const groupId = m.chat;

    // Handle activation commands for groups
    if (isGroup && m.text) {
        if (m.text.toLowerCase() === '$start') {
            groupActivation[groupId] = true;
            await this.sendMessage(m.chat, { text: '✅ MediaHub ha sido activado en este grupo.' });
            return true;
        } else if (m.text.toLowerCase() === '$stop') {
            groupActivation[groupId] = false;
            await this.sendMessage(m.chat, { text: '❌ MediaHub ha sido desactivado en este grupo.' });
            return true;
        }
    }

    // Check if bot should respond
    if (isGroup && !groupActivation[groupId]) {
        return; // Don't respond if bot is not activated in the group
    }

    const userId = m.sender;
    const userMessage = m.text || m.body;
    const preference = checkUserPreference(userMessage);
    if (preference) userPreferences[userId] = preference;
    const userMode = userPreferences[userId] || 'text';

    const { isImageRequest, isModification } = detectImageRequest(userMessage, userId);
    const prompt = userMode === 'voice' ? generateVoicePrompt(userId, userMessage) : generateTextPrompt(userId, userMessage);

    await this.sendPresenceUpdate('composing', m.chat);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const apiResponse = await fetchResponseFromAPI(prompt);
    const botResponse = apiResponse || "Lo siento, estoy teniendo problemas para responder. Inténtalo más tarde.";

    updateMemory(userId, userMessage, botResponse);

    // Manejo de imágenes
    if (isImageRequest) {
        await this.sendMessage(m.chat, { text: isModification ? 
            "🎨Claro Puedo Hacerlo Dame Un Momento..." : 
            "☺️Claro Un Momento Porfavor Estoy Creando Tu Imagen ..." 
        });
        
        const imagePrompt = extractImagePrompt(botResponse);
        const generatedImage = await generateImage(imagePrompt, userId, isModification);
        
        if (generatedImage) {
            await this.sendMessage(m.chat, { 
                image: generatedImage.buffer, 
                caption: `♥️Imagen Creada Que Te Parece?`
            });
        } else {
            await this.sendMessage(m.chat, { 
                text: "Lo siento, no pude generar la imagen en este momento. Por favor, inténtalo de nuevo." 
            });
        }
    }

    // Manejo de texto/voz
    if (!isImageRequest) {
        if (userMode === 'voice') {
            const ttsAudio = await fetchTTSAudio(botResponse);
            if (ttsAudio) {
                await this.sendMessage(m.chat, { audio: ttsAudio, mimetype: 'audio/mpeg', ptt: true });
            } else {
                await this.sendMessage(m.chat, { text: botResponse });
            }
        } else {
            await this.sendMessage(m.chat, { text: botResponse });
        }
    }

    return true;
};

export default handler;