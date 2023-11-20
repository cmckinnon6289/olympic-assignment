function title() {
    document.title = `${getCountryParam() ? getCountryParam().get("country") : "UNKNOWN"} Statistics`;
}

function getCountryParam() {
    return new URLSearchParams(window.location.search);
}

function displayCountryInfo() {
    console.log(getCountryData(getCountryParam()));
}

displayCountryInfo();