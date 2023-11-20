function title() {
    document.title = `${new URLSearchParams(window.location.search).toString() ? new URLSearchParams(window.location.search).get("country") : "UNKNOWN"} Statistics`;
}