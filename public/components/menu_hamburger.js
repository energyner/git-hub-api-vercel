/*Ejecucion del menu desplegable en cualquier parte de la pantalla */

function onClickMenu() {
    const container = document.getElementById("lms-main-menu-container");
    const menu = container.querySelector("#nav");
    const menuBg = container.querySelector("#menu-bg");
    const menuBtn = container.querySelector("#menu");

    // Alternar la clase 'change' en el ícono del menú
    menuBtn.classList.toggle("change");

    // Alternar la clase 'open' para el fondo del menú
    menuBg.classList.toggle('open');

    // Mostrar/ocultar el menú y el fondo
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
        menuBg.style.display = 'none';
    } else {
        menu.style.display = 'block';
        menuBg.style.display = 'block';
    }
}

// Detectar clics fuera del menú para ocultarlo
document.addEventListener('click', function(event) {
    const container = document.getElementById("lms-main-menu-container");
    const menu = container.querySelector("#nav");
    const menuBg = container.querySelector("#menu-bg");
    const menuBtn = container.querySelector("#menu");
    
    // Comprobar si el clic ocurrió fuera del menú y el botón del menú
    if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
        // Si el menú está visible, lo ocultamos
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
            menuBg.style.display = 'none';

            // También podemos eliminar la clase 'change' del ícono
            menuBtn.classList.remove("change");
            menuBg.classList.remove('open');
        }
    }
});

window.onscroll = function() {
    var menu = document.getElementById('menu-bar');
    if (menu) {
    var scrolled = window.scrollY;
    menu.style.transform = 'translateY(' + scrolled + 'px)';
   }
};
