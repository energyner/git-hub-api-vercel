/*---EN PRODUCCION SE ACTIVA 1=====
=====EN DESARROLLO SE ACRIVA 2=====*/

/*=======1 - Archivo apikey.mjs para VERCEL=========*/
// import dotenv from 'dotenv';
// import path from 'path';

// // Configuramos dotenv para leer .env.local de forma robusta
// dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// /**
//  * Prioriza la variable inyectada por Vercel.
//  * Nota: Vercel la descargó como 'apiKey', pero si en el futuro la renombras 
//  * en el panel a 'GOOGLE_TRANSLATE_KEY', el código seguirá funcionando.
//  */
// export const apiKey = process.env.apiKey || process.env.GOOGLE_TRANSLATE_KEY;

// if (!apiKey) {
//     console.warn("⚠️ Advertencia: No se encontró la API Key en las variables de entorno.");
// }

/*=========2 - Archivo apikey.mjs para AMBIENTE LOCAL==========*/
// Definición de la constante API Key
export const apiKey = "AIzaSyBoK9X52A-SDenOoMRU28PeqYRETWKLL94";
