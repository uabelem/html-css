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

const sections = ['basic', 'justifycont', 'justifyitems', 'alignitems', 'flexflow', 'flex']

const show = (active) => sections.forEach(id =>
    window[id].style.display = id === active ? 'block' : 'none'
)

const sBasic = () => show('basic')
const sJustifycont = () => show('justifycont')
const sJustifyitems = () => show('justifyitems')
const sAlignitems = () => show('alignitems')
const sFlexflow = () => show('flexflow')
const sFlex = () => show('flex')

function setActive(el) {
    document.querySelectorAll('#navmenu li').forEach(li => li.classList.remove('active'));
    el.classList.add('active');
}