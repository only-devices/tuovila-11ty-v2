var darkMode = window.sessionStorage.getItem('darkMode');

function lightsOn() {
    document.querySelector('input[id="mode-toggle"]').checked = false;
    document.querySelector('.switch-label').innerText = 'Stealthify';
}

function lightsOff() {
    document.querySelector('input[id="mode-toggle"]').checked = true;
    document.querySelector('.switch-label').innerText = 'Unstealthify';
}

if (!darkMode) {
    darkMode = false;
    lightsOn();
}
else if (darkMode === "true") {
    darkMode = true;
    lightsOff();
}
else {
    darkMode = false;
    lightsOn();
}
mode();
// Unhide page after darkMode config is processed to solve page flicker
document.body.classList.remove("fade");

function darkToggle() {
    toggle();
    mode();
}

function mode() {
    if (darkMode || darkMode) {
        document.querySelectorAll('*').forEach(i => { i.classList.add("dark") });
        lightsOff();
    }
    else {
        document.querySelectorAll('*').forEach(i => { i.classList.remove("dark") });
        lightsOn();
    }
}

function toggle() {
    darkMode = !darkMode;
    window.sessionStorage.setItem('darkMode', darkMode);
}