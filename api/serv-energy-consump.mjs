

/*PRUEBAS */
 /*energy-consumption.mjs - servidor */
import express from 'express';
import cors from 'cors';
import { calculateEnergy } from '/_calculations/energy-consump-function.mjs';
import translateHandler from '/translate.mjs';

const app = express();

// Middlewares necesarios para desarrollo local
app.use(cors());
app.use(express.json());

/**
 * TAREA 1: API Energy Consumption
 * Endpoint: /api/energy-consump
 */
app.post('/api/serv-energy-consump', (req, res) => {
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


// INICIO DEL SERVIDOR (Local abre puerto 3002)
// EN PRODUCCION 
if (process.env.NODE_ENV !== 'production') {
const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n============== ENERGYNER API GATEWAY (LOCAL) ==============`);
    console.log(`✅ Servidor escuchando en: http://localhost:${PORT}`);
    console.log(`✅ Entorno detectado: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚀 Servidor listo en: http://localhost:${PORT}`);
    console.log(`📂 Endpoints activos:`);
    console.log(`   👉 POST /api/energy-consump    (Cálculo de Eficiencia)`);
    console.log(`   👉 POST /api/translate (Traductor + MySQL Cache)`);
    console.log(`===========================================================\n`);
});
}
// 3. LA EXPORTACIÓN (Obligatoria para Vercel)
// Nunca se silencia; es el puente de comunicación con la nube.
export default app;


