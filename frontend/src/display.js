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

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export async function viewAlert(message, success) {
    let _id;
    if (success) {
        _id = "success-alert-box";
    } else {
        _id = "fail-alert-box";
    }    
    var alert_box = document.getElementById(_id);
    setElementDisplay(_id, "block");
    alert_box.classList.add("animate__animated");
    alert_box.classList.add("animate__fadeInUp");
    alert_box.innerHTML = message;
    await sleep(3000).then( () => {
        alert_box.classList.remove("animate__fadeInUp") 
        alert_box.classList.add("animate__fadeOutDown") 
    });
    await sleep(400).then(
        () => {
            setElementDisplay(_id, "none");
            alert_box.classList.remove("animate__fadeOutDown")
            alert_box.innerHTML = "";
        }
    );
}