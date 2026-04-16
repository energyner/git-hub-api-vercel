/**
 * API: Energy Consumption (Serverless - Vercel Ready)
 */

import { calculateEnergy } from './_calculations/energy-consump-function.mjs';

export default async function handler(req, res) {

    // 🔐 CORS básico (opcional pero recomendado)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 🟢 HEALTH CHECK
    if (req.method === 'GET') {
        return res.status(200).json({ status: "OK" });
    }

    // 🔴 SOLO POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {

        // 🔥 1. Parse seguro del body
        let data;

        try {
            data = typeof req.body === "string"
                ? JSON.parse(req.body)
                : req.body;
        } catch {
            return res.status(400).json({ error: "Invalid JSON" });
        }

        if (!data || typeof data !== 'object') {
            return res.status(400).json({ error: "Invalid payload" });
        }

        // 🔥 2. Sanitización y tipado seguro
        const payload = {
            stream: data.stream,
            tension: toNumber(data.tension),
            intensity: toNumber(data.intensity),
            cosf: toNumber(data.cosf),
            efm: toNumber(data.efm),
            potnom: toNumber(data.potnom),
            efm1: toNumber(data.efm1)
        };

        // 🔥 3. Validación mínima
        if (!payload.stream && payload.potnom === 0) {
            return res.status(400).json({
                error: "Missing required parameters"
            });
        }

        // 🔥 4. Ejecución segura
        const resultados = calculateEnergy(payload);

        if (!resultados || typeof resultados !== "object") {
            throw new Error("Invalid calculation result");
        }

        return res.status(200).json(resultados);

    } catch (error) {

        console.error("API ERROR:", error);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

/**
 * Conversión segura a número
 */
function toNumber(value) {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
}
