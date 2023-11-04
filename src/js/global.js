var darkMode = window.sessionStorage.getItem('darkMode');
if(!darkMode){
	darkMode = false;
    document.querySelector('input[id="mode-toggle"]').checked = false;
}
else if(darkMode === "true"){
	darkMode = true;
    document.querySelector('input[id="mode-toggle"]').checked = true;
}
else{
	darkMode = false;
    document.querySelector('input[id="mode-toggle"]').checked = false;
}//
mode();

function darkToggle(){
	toggle();
	mode();
}

function mode(){
	if(darkMode || darkMode){
		document.querySelectorAll('*').forEach(i => {i.classList.add("dark")})
	}
	else{
		document.querySelectorAll('*').forEach(i => {i.classList.remove("dark")})
	}
}

function toggle(){
	darkMode = !darkMode;
	window.sessionStorage.setItem('darkMode',darkMode);	
}