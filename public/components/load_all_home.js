/*ESTA PAGINA DE JAVASCRIPT LOAD_ALL_HOME.JS ES LA CONTIENE LA RUTA PARA ENCONTRAR 
LOS FILES MENU_HOME Y  FOOTER DENTRO DE LA SUB-CARPETA DOC, A SU VEZ ALMACENADA EN LA SUB-CARPETA ASSETS
DESDE LOS ARCHIVOS QUE SE ENCUENTRA EN LA RAIZ DEL SITIO WEB. 
ESTA RUTA ES TOTALMENTE DIFERENTE A LA RUTA PARA ENCONTRAR ESTOS FILE
 DESDE LAS SUBCARPETAS 00-intro, 01-estilos, ETC  */
 /*LA URL DEL FILE MENU_HOME ES DIFERENTE A LAS DEL FILE MENU*/
/*PARA LOS ARCHIVOS EN ESTA POSICION DEBE USARSE LA PAGINA LOAD_ALL.JS*/

/*    La function loadALL tiene la tarea de cargar las paginas exteriores que se incluiran en una pagina*/
/*  dentro de la funcction se pueden agregar multipes propiedades en loadHTML('url.html', 'id de la div');*/
/* Cuando usas onload="loadAll()" en la etiqueta <body>, estás indicando que la función loadAll debe ejecutarse 
solo después de que todo el contenido de la página esté completamente cargado. 
Esto asegura que todos los elementos del DOM estén disponibles para manipulación.  */

function loadHTML(url, elementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading HTML:', error);
        });
}

/**
 * ARCHIVO: load_all_home.js
 * Función universal para carga de componentes comunes (Menu, Footer, Dropdown)
 * Adaptable a cualquier profundidad de directorio.
 */

function loadAll_home() {
    // 1. Buscamos el script por su nombre de archivo físico
    // Esto es más seguro que document.currentScript en eventos diferidos
    const scripts = document.getElementsByTagName('script');
    let scriptPath = "";

    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes('load_all_home.js')) {
            scriptPath = scripts[i].src;
            break;
        }
    }

    if (!scriptPath) {
        console.error("Error crítico: No se pudo localizar la ruta de load_all_home.js");
        return;
    }

    // 2. Extraemos la base dinámica (Todo lo anterior a /components/)
    const urlParts = scriptPath.split('/components/');
    const BASE_DYNAMIC = `${urlParts[0]}/doc/`;

    // 3. Definición de elementos a cargar
  const scriptPath = document.currentScript.src;

// 1. Extraemos todo lo anterior a /components/
const base = scriptPath.split('/components/')[0];

// 2. Construimos la ruta correcta hacia /assets/doc/
const BASE_DYNAMIC = `${base}/assets/doc/`;

// 3. Definimos los elementos
const elements = [
    { url: `${BASE_DYNAMIC}menu_home.html`, id: 'lms-main-menu-container' },
    { url: `${BASE_DYNAMIC}dropdown_home.html`, id: 'nav2' },
    { url: `${BASE_DYNAMIC}footer.html`, id: 'footer' }
];

    // 4. Ejecución de la carga
    elements.forEach(element => {
        const el = document.getElementById(element.id);
        if (el) {
            console.log(`Cargando: ${element.url} -> #${element.id}`);
            loadHTML(element.url, element.id);
        } else {
            console.warn(`Contenedor #${element.id} no presente en este index.`);
        }
    });
}

// Disparar la función cuando el DOM esté listo
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAll_home);
} else {
    loadAll_home(); // Por si el DOM ya estaba listo
}

document.addEventListener("DOMContentLoaded", loadAll_home);