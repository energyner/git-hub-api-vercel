GIR-HUB-API-VERCEL

Una plataforma Global de multiples APIs - Hub de microservicios.



Mision y Vision del proyecto

El nuevo proyecto Energyner evoluciona de una aplicación aislada a una infraestructura de microservicios escalable y de alto rendimiento. Mediante el repositorio git-hub-api--vercel, desacoplamos la lógica de negocio para construir un Hub de APIs capaz de procesar datos críticos en múltiples dimensiones del conocimiento.



El horizonte de este proyecto trasciende el desarrollo de software convencional; aspiramos a consolidar una plataforma de integración donde las APIs modulares se transformen con agilidad en Aplicaciones Web Progresivas (PWAs) descargables en cualquier dispositivo móvil.



Nuestra misión es democratizar el acceso a herramientas de cálculo y análisis especializado, creando un entorno tan intuitivo para el público general como potente y atractivo para la comunidad de desarrolladores, lo que hemos llamado “Un Hub de Conocimiento y Colaboración”. 



Estructura, explorador de archivos del proyecto. Calificacion entre activos comunes y propios de cada API 



FRONTEND (ZONA VISUAL)

<head>

public/assets/css/main1.css" /><!--Estilos comunes menú hamburguesa-->

public/assets/css/main11.css" /> <!--Estilos comunes de selectores HTML a las páginas index.html de cada API-->

public/assets/css/idioms.css">  <!--Estilos comunes menú Traductor Desplegable Google Trasnlator-->

public/assets/css/energy-consump.css"><!--Estilos propios de selectores HTML de cada paginas index.html de cada API-->

public/manifest.json"><!—Archivo común que define identidad visual,  comportamiento de instalación, apariencia tipo app móvil - PWA.



<header>

public/assets/img/loggo.png <!--Imagen común del Logo corporativo-->

<main>

public/assets/js/api-app.js <!—Archivo común para registrar el Service Worker, Gestionar el proceso de instalación en Adorid e iOS-->



<end>

public/assets/js/menu\_hamburger.js"><!—Logica común  del  menu hamburguesa-->

public/assets/js/load\_all\_home.js"><!---Carga paginas comunes html que se importaran a la página index.html (menu, footer, dropdown-->

public/assets/js/translator.js"><!--Logica común del menu traduccion, carga la API y coneccion Google Translator-->     

public/assets/js/energy-consump.js"  ><!--Logica de los componentes propios de cada pagina-->  



BACKEND (ZONA OCULTA)

api/server/serv-energy-consump-app.mjs <!--Servidor - controlador propio de la API - Cálculos - Conexión a funciones-->  

api/\_calculations/energy-consump-function.mjs <!--Funciones propias de cada API - Calculos-->



Autor: Rene F. Ruano

04/10/2026  



