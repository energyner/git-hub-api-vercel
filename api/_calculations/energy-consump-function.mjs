/*energy-consump-function.mjs*/
// Lógica de cálculo de energía para el motor y cadena fósil
export function calculateEnergy(data) {
    const { stream, tension, intensity, cosf, efm, potnom, efm1 } = data;

    let kWh_motor = 0;
    let eficienciaAplicada = 0;

    // Validación de entrada principal
    if (potnom && parseFloat(potnom) > 0) {
        // Opción B: Potencia nominal instalada conocida
        kWh_motor = parseFloat(potnom);
        eficienciaAplicada = parseFloat(efm1);
    } else {
        // Opción A: Calcular potencia por parámetros eléctricos
        const V = parseFloat(tension);
        const A = parseFloat(intensity);
        const PF = parseFloat(cosf);
        eficienciaAplicada = parseFloat(efm);

        if (parseInt(stream) === 1) {
            // Monofásico
            kWh_motor = (V * A * PF) / 1000;
        } else if (parseInt(stream) === 2) {
            // Trifásico (1.7321 = raíz de 3)
            kWh_motor = (1.7321 * V * A * PF) / 1000;
        }
    }

    // --- Cadena Energética (Fórmulas del PHP original) ---
    // 10.5 y 0.3 son factores de conversión térmica/eléctrica del código original
    const kWh_primario = kWh_motor * 0.3 * 10.5;
    const kWh_transf = kWh_primario - kWh_motor;
    const kWh_eje = kWh_motor * eficienciaAplicada;
    
    // Emisiones CO2 (Factor 0.9 kg/kWh)
    const kgCO2_primario = kWh_motor * 0.9;
    const kgCO2_eje = kWh_eje * 0.9;

    // Porcentajes y Pérdidas
    const perdidas_transf_pct = ((kWh_primario - kWh_transf) / kWh_primario) * 100;
    const perdidas_motor = kWh_motor * (1 - eficienciaAplicada);
    const pct_eje_sobre_primario = (kWh_eje * 100) / kWh_primario;

    return {
        kWh_motor: kWh_motor.toFixed(2),
        kWh_primario: kWh_primario.toFixed(2),
        kWh_transf: kWh_transf.toFixed(2),
        kWh_eje: kWh_eje.toFixed(2),
        kgCO2_primario: kgCO2_primario.toFixed(2),
        kgCO2_eje: kgCO2_eje.toFixed(2),
        perdidas_motor: perdidas_motor.toFixed(2),
        perdidas_transf_pct: perdidas_transf_pct.toFixed(2),
        eficiencia_usada: eficienciaAplicada.toFixed(2),
        pct_final: pct_eje_sobre_primario.toFixed(2)
    };
}