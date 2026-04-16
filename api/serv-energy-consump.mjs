 /*energy-consumption.mjs - servidor */
import { calculateEnergy } from './calculations/energy-consump-function.mjs';
import translateHandler from './translate.mjs';

export default async function handler(req, res) {

    if (req.method === 'POST') {
        try {
            const data = req.body;
            const resultados = calculateEnergy(data);

            return res.status(200).json(resultados);

        } catch (error) {
            return res.status(500).json({
                error: 'Error en el cálculo',
                detalle: error.message
            });
        }
    }

    return res.status(405).json({ error: 'Método no permitido' });
}

