/*ETAPA PRODUCCION*/
// /*energy-consumption.mjs - servidor */
// /*Etapa de desarrollo se mantiene export default async function handler*/
// /*Etapa de produccion - Vercel - se pasa a  default async function handler y al final del archivo export default app;*/
// import { calculateEnergy } from './_calculations/energy-logic.mjs';

// export default async function handler(req, res) {
//     // Solo permitimos POST (desde tu formulario)
//     if (req.method !== 'POST') {
//         return res.status(405).json({ error: 'Método no permitido' });
//     }

//     try {
//         const data = req.body;
        
//         // Ejecutamos la lógica refactorizada
//         const resultados = calculateEnergy(data);

//         // Respondemos con el objeto de resultados
//         res.status(200).json(resultados);
//     } catch (error) {
//         res.status(500).json({ error: 'Error en el cálculo', detalle: error.message });
//     }
// }

// if (process.env.NODE_ENV !== 'production') {
//     const PORT = process.env.PORT || 3002;
//     app.listen(PORT, '0.0.0.0', () => {
//         console.log(`\n============== ENERGYNER API GATEWAY (LOCAL) ==============`);
//         console.log(`✅ Servidor escuchando en: http://0.0.0.0:${PORT}`);
//         console.log(`📂 Módulos: Consumo, Solar, Carbono, Calorias, Vapor`);
//         console.log(`===========================================================\n`);
//     });
// }
// // CRÍTICO PARA VERCEL: Exportar la instancia de la app
// //export default app;

/*PRUEBAS LOCALES */
 /*energy-consumption.mjs - servidor */
import express from 'express';
import cors from 'cors';
import { calculateEnergy } from './_calculations/energy-consump-function.mjs';
import translateHandler from './translate.mjs';

const app = express();

// Middlewares necesarios para desarrollo local
app.use(cors());
app.use(express.json());

/**
 * TAREA 1: API Energy Consumption
 * Endpoint: /api/energy-consump
 */
app.post('/api/energy-consump', (req, res) => {
    try {
        const data = req.body;
        // La lógica sigue importada de energy-logic.mjs
        const resultados = calculateEnergy(data);
        res.status(200).json(resultados);
    } catch (error) {
        res.status(500).json({ 
            error: 'Error en el cálculo de consumo energético', 
            detalle: error.message 
        });
    }
});

/**
 * TAREA 2: API Google Translate (con conexión a DB)
 * Reutilizamos el handler que ya tienes para mantener la consistencia con Vercel
 */
app.post('/api/translate', translateHandler);

// INICIO DEL SERVIDOR (Solo local)
const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n============== ENERGYNER API GATEWAY (LOCAL) ==============`);
    console.log(`✅ Servidor escuchando en: http://localhost:${PORT}`);
    console.log(`📂 Endpoints activos:`);
    console.log(`   👉 POST /api/energy-consump    (Cálculo de Eficiencia)`);
    console.log(`   👉 POST /api/translate (Traductor + MySQL Cache)`);
    console.log(`===========================================================\n`);
});