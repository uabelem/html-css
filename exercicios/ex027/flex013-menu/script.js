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
    if (window.innerWidth >= 667) {
        navmenu.style.display = 'block'
        menu.innerHTML = 'menu'
    } else {
        navmenu.style.display = 'none'
        menu.innerHTML = 'menu'

    }
}

function sBasic() {
    basic.style.display = 'block'
    justifycont.style.display = 'none'
    justifyitems.style.display = 'none'
    alignitems.style.display = 'none'
    flexflow.style.display = 'none'
    flex.style.display = 'none'
}
function sJustifycont() {
    basic.style.display = 'none'
    justifycont.style.display = 'block'
    justifyitems.style.display = 'none'
    alignitems.style.display = 'none'
    flexflow.style.display = 'none'
    flex.style.display = 'none'
}
function sJustifyitems() {
    basic.style.display = 'none'
    justifycont.style.display = 'none'
    justifyitems.style.display = 'block'
    alignitems.style.display = 'none'
    flexflow.style.display = 'none'
    flex.style.display = 'none'
}
function sAlignitems() {
    basic.style.display = 'none'
    justifycont.style.display = 'none'
    justifyitems.style.display = 'none'
    alignitems.style.display = 'block'
    flexflow.style.display = 'none'
    flex.style.display = 'none'
}
function sFlexflow() {
    basic.style.display = 'none'
    justifycont.style.display = 'none'
    justifyitems.style.display = 'none'
    alignitems.style.display = 'none'
    flexflow.style.display = 'block'
    flex.style.display = 'none'
}
function sFlex() {
    basic.style.display = 'none'
    justifycont.style.display = 'none'
    justifyitems.style.display = 'none'
    alignitems.style.display = 'none'
    flexflow.style.display = 'none'
    flex.style.display = 'block'
}

function setActive(el) {
    document.querySelectorAll('#navmenu li').forEach(li => li.classList.remove('active'));
    el.classList.add('active');
}