export function handleCategoryViewChange(category) {
    var SWITCHES = document.querySelectorAll('div[id*="-swt"]');
    SWITCHES.forEach((swt) => {
        swt.classList.remove('active-category');
    });
    document.getElementById(category + '-swt').classList.add('active-category');
}

export function setActiveCategoryStyles(id) {
    document.getElementById(id).classList.add('active-category');
}

export function setElementDisplay(id, mode) {
    document.getElementById(id).style.display = mode;
}

export function setDateInputValue() {
    return new Date().toISOString().slice(0,10);
}