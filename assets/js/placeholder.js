let geotastic = ["St Helena, Ascension and Tristan da Cunha","South Georgia and the South Sandwich Islands","British Indian Ocean Territory","American Samoa","France Southern and Antarctic Lands","Cocos (Keeling) Islands","Heard Island and McDonald Islands","Comoros","Mayotte"];

function nameGen() {
    let placeholders = document.querySelectorAll(".country-input");
    placeholders.forEach(inputElement => {
        let name = geotastic[Math.round(Math.random()*geotastic.length)];
        inputElement.setAttribute("placeholder",name);
    })
}

document.addEventListener("DOMContentLoaded", (event) => { nameGen(); });