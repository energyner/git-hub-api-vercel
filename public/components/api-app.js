//api-app.js
// --- 1. Registro Único del Service Worker p/ Vercel---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // En Vercel, lo ideal es que el SW esté en la raíz de la carpeta public
        navigator.serviceWorker.register('../energy-consump-app/sw.js')
            .then(reg => console.log('PWA: SW activo en', reg.scope))
            .catch(err => console.error('PWA: Error en SW', err));
    });
}

// --- 2. Estado Global y Selectores ---
let deferredPrompt;
const installBtn = document.getElementById('install-button');
const installSection = document.getElementById('install-section');

// --- 3. Lógica Universal de Instalación ---
const isIos = () => /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
const isStandalone = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// Función para mostrar la sección de instalación
const showInstallUI = () => {
    if (installSection) installSection.style.display = 'block';
};

// A. CASO ANDROID/CHROME
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallUI();
});

// B. CASO iOS/SAFARI
if (isIos() && !isStandalone()) {
    showInstallUI();
}

// --- 4. Acción del Botón (Unificada) ---
installBtn?.addEventListener('click', async () => {
    if (deferredPrompt) {
        // Ejecución para Android
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Instalación: ${outcome}`);
        deferredPrompt = null;
        if (installSection) installSection.style.display = 'none';
    } else if (isIos()) {
        // Ejecución para iOS
        alert("📲 Instalación en Apple:\n1. Toca el icono 'Compartir' (cuadrado con flecha).\n2. Desliza y elige 'Añadir a pantalla de inicio'.");
    }
});
//FIN DE LOS SCRIPTS MANIPULADORES-->
