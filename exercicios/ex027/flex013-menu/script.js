function verMenu() {
    if (navmenu.style.display !== 'block') {
        navmenu.style.display = 'block'
        menu.innerHTML = 'menu_open'
    } else {
        navmenu.style.display = 'none'
        menu.innerHTML = 'menu'
    }
}

function mudouTamanho() {
    if (window.innerWidth >= 530) {
        navmenu.style.display = 'block'
        menu.innerHTML = 'menu'
    } else {
        navmenu.style.display = 'none'
        menu.innerHTML = 'menu'

    }
}