//api-app.js
//SCRIPT PARA TRANSFORMAR LA APLICACION EN APPS-->

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('SW registrado con éxito'))
        .catch(err => console.log('Fallo al registrar SW', err));
    });
  }

//FIN DE LOS SCRIPT DE TRANFORMACION-->

//SCRIPT QUE MANIPULA LOS LINKS-->

let deferredPrompt;
const installBtn = document.getElementById('install-button');
const installSection = document.getElementById('install-section');

// Lógica para ANDROID
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installSection.style.display = 'block'; // Mostramos el botón

    installBtn.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario aceptó la instalación');
            }
            deferredPrompt = null;
        });
    });
});

// Lógica para detectar iOS y mostrar instrucciones
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}
const inStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

if (isIos() && !inStandaloneMode()) {
    installSection.style.display = 'block';
    installBtn.addEventListener('click', () => {
        alert("En tu iPhone: Pulsa 'Compartir' y luego 'Añadir a pantalla de inicio' para instalar la App de RLG.");
    });
}

//Cargando el script mediante código. No se "ejecuta" como un script normal en el HTML.
 if ('serviceWorker' in navigator) { navigator.serviceWorker.register('../sw.js') .then(() => console.log('Service Worker Activo')) .catch(err => console.log('Error de SW:', err)); }
//FIN DE LOS SCRIPTS MANIPULADORES-->
