/** 
 * File enrgy-consump.js
 * Frontend Logic for Energy Consumption App
 * Hub: git-hub-api-vercel
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); 
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            // 1. Captura de datos y conversión técnica
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

            // 2. Validación básica en el cliente
            if (data.stream === "Make your selection" && (!data.potnom || data.potnom == 0)) {
                alert("Please select the motor type or enter the rated power..");
                return;
            }

            try {
                /* -----------------------------------------------------------
                   🆕 SOCKET HÍBRIDO: DETECCIÓN DINÁMICA DE ENTORNO
                   ----------------------------------------------------------- */
                 const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);
                const API_URL = isLocal 
                    ? "http://127.0.0.1:3002/api/energy-consump" // Puerto del servidor Node local
                    : "/api/energy-consump";    

                console.log(`🚀 Enviando petición a: ${API_URL}`);

                // 3. Envío al Backend (Endpoint Serverless o Local)
                const response = await fetch(API_URL, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) throw new Error(`Error HTTPS: ${response.status}`);

                const result = await response.json();

                // 4. Procesamiento de resultados
                displayResults(result);

            } catch (error) {
                console.error('Error en el Socket Híbrido:', error);
                alert("Hubo un problema al calcular los datos. Verifique la conexión con el servidor local (Puerto 3002).");
            }
        });
    }
});

/**
 * Función para renderizar los resultados en el "Panel de Salida"
 */
function displayResults(res) {
    console.log("Sincronizando Panel con:", res);

    // Mapeo exhaustivo de los resultados del backend -> IDs del HTML
    const fields = {
        'res_kWh_motor':          res.kWh_motor,
        'res_kWh_primario':       res.kWh_primario,
        'res_kWh_transf':         res.kWh_transf,
        'res_kWh_eje':            res.kWh_eje,
        'res_kgCO2_primario':     res.kgCO2_primario,
        'res_kgCO2_eje':          res.kgCO2_eje,
        'res_perdidas_motor':     res.perdidas_motor,
        'res_perdidas_transf_pct': res.perdidas_transf_pct,
        'res_eficiencia_usada':   res.eficiencia_usada,
        'res_pct_final':          res.pct_final
    };

    // Actualización masiva del DOM
    for (const [id, value] of Object.entries(fields)) {
        const element = document.getElementById(id);
        if (element) {
            // Animación simple de actualización de texto
            element.textContent = value;
        } else {
            console.warn(`Advertencia: El elemento ID ${id} no se encontró en el HTML.`);
        }
    }

    // Scroll suave al panel de resultados
    const panelResultados = document.getElementById('panel-resultados');
    if (panelResultados) {
        panelResultados.scrollIntoView({ behavior: 'smooth' });
    }
}