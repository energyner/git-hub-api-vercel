/**
 * energy-consump.js
 * Frontend Logic (Production Ready - Vercel)
 */

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('energyForm');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 🔹 1. Captura de datos
        const formData = new FormData(form);

        const data = {
            stream: formData.get('stream'),
            tension: parseFloat(formData.get('tension')) || 0,
            intensity: parseFloat(formData.get('intensity')) || 0,
            cosf: parseFloat(formData.get('cosf')) || 0,
            efm: parseFloat(formData.get('efm')) || 0,
            potnom: parseFloat(formData.get('potnom')) || 0,
            efm1: parseFloat(formData.get('efm1')) || 0
        };

        // 🔹 2. Validación
        if (!data.stream && data.potnom === 0) {
            alert("Select motor type or enter nominal power.");
            return;
        }

        try {
            // 🔥 3. Endpoint RELATIVO (clave en Vercel)
            const response = await fetch(`${window.location.origin}/api/serv-energy-consump`, {
            method: 'POST',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const result = await response.json();

            // 🔹 4. Render
            displayResults(result);

        } catch (error) {
            console.error('API Error:', error);
            alert("Error calculating data. Please try again.");
        }
    });
});


/**
 * Render de resultados
 */
function displayResults(res) {

    const fields = {
        'res_kWh_motor': res.kWh_motor,
        'res_kWh_primario': res.kWh_primario,
        'res_kWh_transf': res.kWh_transf,
        'res_kWh_eje': res.kWh_eje,
        'res_kgCO2_primario': res.kgCO2_primario,
        'res_kgCO2_eje': res.kgCO2_eje,
        'res_perdidas_motor': res.perdidas_motor,
        'res_perdidas_transf_pct': res.perdidas_transf_pct,
        'res_eficiencia_usada': res.eficiencia_usada,
        'res_pct_final': res.pct_final
    };

    for (const [id, value] of Object.entries(fields)) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = formatNumber(value);
        }
    }

    // Scroll suave
    document.getElementById('panel-resultados')
        ?.scrollIntoView({ behavior: 'smooth' });
}


/**
 * Formateo numérico seguro
 */
function formatNumber(value) {
    return (typeof value === "number")
        ? value.toFixed(2)
        : value ?? "0.00";
}