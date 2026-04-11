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

function loadAll_home() {
    const BASE = "../assets/doc/";

    const elements = [
        {url: `${BASE}menu_home.html`, id: 'lms-main-menu-container'},
        {url: `${BASE}dropdown_home.html`, id: 'nav2'},
        {url: `${BASE}footer.html`, id: 'footer'},
        
    ];

    elements.forEach(element => {
        console.log(`Attempting to load HTML into element with id: ${element.id}`);
        const el = document.getElementById(element.id);
        if(el){
            loadHTML(element.url, element.id);
        }else{
            console.warn(`Element with id "${element.id}" not found`);
        }
    });
}
document.addEventListener("DOMContentLoaded", loadAll_home);