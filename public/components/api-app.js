//api-app.js
/* ============================================================
   1️⃣ REGISTRO SERVICE WORKER (CORRECTO PARA VERCEL)
   ============================================================ */

if ('serviceWorker' in navigator) {

    window.addEventListener('load', async () => {

        try {

            const reg = await navigator.serviceWorker.register(
                '/energy-consump-app/sw.js',
                { scope: '/energy-consump-app/' }
            );

            console.log('✅ PWA: Service Worker activo en →', reg.scope);

        } catch (err) {

            console.error('❌ PWA: Error registrando SW →', err);

        }

    });

}

/* ============================================================
   2️⃣ ESTADO GLOBAL Y ELEMENTOS DOM
   ============================================================ */

let deferredPrompt = null;

const installBtn = document.getElementById('install-button');
const installSection = document.getElementById('install-section');

/* ============================================================
   3️⃣ UTILIDADES DE DETECCIÓN
   ============================================================ */

const isIos = () =>
    /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

/* ============================================================
   4️⃣ UI CONTROL
   ============================================================ */

const showInstallUI = () => {
    if (installSection) {
        installSection.style.display = 'block';
        console.log('📲 UI instalación visible');
    }
};

const hideInstallUI = () => {
    if (installSection) {
        installSection.style.display = 'none';
    }
};

/* ============================================================
   5️⃣ EVENTO ANDROID / CHROME
   ============================================================ */

window.addEventListener('beforeinstallprompt', (e) => {

    console.log('📩 beforeinstallprompt detectado');

    e.preventDefault(); // 🔥 crítico

    deferredPrompt = e;

    showInstallUI();

});

/* ============================================================
   6️⃣ DETECCIÓN iOS (SIN beforeinstallprompt)
   ============================================================ */

window.addEventListener('load', () => {

    if (isIos() && !isStandalone()) {

        console.log('📱 iOS detectado → mostrar instrucciones');

        showInstallUI();

    }

});

/* ============================================================
   7️⃣ BOTÓN INSTALAR (UNIFICADO)
   ============================================================ */

if (installBtn) {

    installBtn.addEventListener('click', async () => {

        // 🔥 ANDROID / CHROME
        if (deferredPrompt) {

            console.log('🚀 Lanzando prompt instalación');

            deferredPrompt.prompt();

            const { outcome } = await deferredPrompt.userChoice;

            console.log(`📊 Resultado instalación: ${outcome}`);

            deferredPrompt = null;

            hideInstallUI();

            return;
        }

        // 🔥 iOS
        if (isIos()) {

            alert(
                "📲 Instalar en iPhone/iPad:\n\n" +
                "1. Pulsa el botón 'Compartir'\n" +
                "2. Selecciona 'Añadir a pantalla de inicio'"
            );

            return;
        }

        console.warn('⚠️ Instalación no disponible en este dispositivo');

    });

}

/* ============================================================
   8️⃣ DEBUG FINAL
   ============================================================ */

window.addEventListener('appinstalled', () => {
    console.log('🎉 PWA instalada correctamente');
    hideInstallUI();
});
