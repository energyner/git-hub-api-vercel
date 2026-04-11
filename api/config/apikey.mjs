/**
 * api/config/apikey.mjs
 * Archivo de configuración para la API Key de Google Translate
 */

// Sustituye el valor entre comillas por tu clave real de Google Cloud Console
import dotenv from 'dotenv';
// Cargamos el archivo local por si acaso, pero priorizamos el entorno real
dotenv.config({ path: '.env.local' });

// 1. Intenta leer de la variable de entorno (para el futuro)
// 2. Si no existe, usa la clave temporal de prueba
export const apiKey = process.env.GOOGLE_TRANSLATE_KEY || "AIzaSyBoK9X52A-SDenOoMRU28PeqYRETWKLL94";