import { db } from './config/localdb-config.mjs';

export default async function handler(req, res) {

    // 🔐 CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {

        // 🔥 1. Parse seguro
        let body;
        try {
            body = typeof req.body === "string"
                ? JSON.parse(req.body)
                : req.body;
        } catch {
            return res.status(400).json({ error: "Invalid JSON" });
        }

        const { texts, lang } = body;

        // 🔥 2. Validación fuerte
        if (!Array.isArray(texts) || texts.length === 0) {
            return res.status(400).json({ error: "Invalid texts array" });
        }

        if (texts.length > 100) {
            return res.status(400).json({ error: "Too many texts (max 100)" });
        }

        if (!lang || typeof lang !== "string") {
            return res.status(400).json({ error: "Invalid language" });
        }

        // 🔥 3. Sanitización
        const cleanTexts = texts
            .map(t => String(t).trim())
            .filter(t => t.length > 0 && t.length <= 500);

        if (cleanTexts.length === 0) {
            return res.status(400).json({ error: "No valid texts" });
        }

        // 🔐 API KEY SOLO DESDE ENV
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "API key not configured" });
        }

        const translations = {};
        const missing = [];

        // 🔥 4. CACHE DB
        for (const text of cleanTexts) {

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

        // 🔥 5. TODO EN CACHE
        if (missing.length === 0) {
            return res.status(200).json(translations);
        }

        // 🔥 6. GOOGLE API (con timeout)
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        let googleData;

        try {
            const response = await fetch(
                `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        q: missing,
                        target: lang,
                        format: 'text'
                    }),
                    signal: controller.signal
                }
            );

            clearTimeout(timeout);

            if (!response.ok) {
                console.error("Google API error:", response.status);
                return res.status(502).json({ error: "Translation service error" });
            }

            googleData = await response.json();

        } catch (err) {
            clearTimeout(timeout);
            console.error("Fetch error:", err);
            return res.status(502).json({ error: "Translation timeout" });
        }

        if (!googleData?.data?.translations) {
            return res.status(502).json({ error: "Invalid response from Google" });
        }

        const googleTranslations = googleData.data.translations;

        // 🔥 7. INSERTS EN PARALELO
        const insertPromises = [];

        for (let i = 0; i < missing.length; i++) {

            const original = missing[i];
            const translated = googleTranslations[i]?.translatedText || original;

            translations[original] = translated;

            insertPromises.push(
                db.execute(
                    'INSERT IGNORE INTO translations (original_text, translated_text, target_lang) VALUES (?, ?, ?)',
                    [original, translated, lang]
                )
            );
        }

        await Promise.all(insertPromises);

        return res.status(200).json(translations);

    } catch (error) {

        console.error("Translator API error:", error);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}