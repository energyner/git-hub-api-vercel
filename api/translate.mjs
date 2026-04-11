import { db } from './config/localdb-config.mjs';
import fetch from 'node-fetch'; // O usa el fetch nativo de Node 24+
import { apiKey as localKey } from './config/apikey.mjs';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite que el puerto 3002 hable con este
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end(); // Responder a la verificación del navegador
    if (req.method !== 'POST') return res.status(405).end();

    const { texts, lang } = req.body;
    const apiKey = process.env.GOOGLE_API_KEY || localKey; // Seguridad: Clave desde variables de entorno
    const translations = {};
    const missing = [];

    try {
        // 1. Buscar en Caché (MySQL)
        for (const text of texts) {
            const [rows] = await db.execute(
                'SELECT translated_text FROM translations WHERE original_text = ? AND target_lang = ? LIMIT 1',
                [text, lang]
            );

            if (rows.length > 0) {
                translations[text] = rows[0].translated_text;
            } else {
                missing.push(text);
            }
        }

        // 2. Si no hay nada pendiente, responder
        if (missing.length === 0) {
            return res.status(200).json(translations);
        }

        // 3. Llamar a Google Translate API para los textos que faltan
        const googleUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
        const response = await fetch(googleUrl, {
            method: 'POST',
            body: JSON.stringify({
                q: missing,
                target: lang,
                format: 'text'
            })
        });

        const data = await response.json();
        const googleTranslations = data.data.translations;

        // 4. Guardar en Caché e integrar resultados
        for (let i = 0; i < missing.length; i++) {
            const original = missing[i];
            const translated = googleTranslations[i].translatedText;

            translations[original] = translated;

            // Inserción asíncrona en la DB
            await db.execute(
                'INSERT IGNORE INTO translations (original_text, translated_text, target_lang) VALUES (?, ?, ?)',
                [original, translated, lang]
            );
        }

        res.status(200).json(translations);

    } catch (error) {
        console.error("Error en traductor:", error);
        res.status(500).json({ error: "Error interno" });
    }
}