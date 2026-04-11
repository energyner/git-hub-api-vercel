/*Archivo apikey.mjs */
import dotenv from 'dotenv';
import path from 'path';

// Configuramos dotenv para leer .env.local de forma robusta
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

/**
 * Prioriza la variable inyectada por Vercel.
 * Nota: Vercel la descargó como 'apiKey', pero si en el futuro la renombras 
 * en el panel a 'GOOGLE_TRANSLATE_KEY', el código seguirá funcionando.
 */
export const apiKey = process.env.apiKey || process.env.GOOGLE_TRANSLATE_KEY;

if (!apiKey) {
    console.warn("⚠️ Advertencia: No se encontró la API Key en las variables de entorno.");
}