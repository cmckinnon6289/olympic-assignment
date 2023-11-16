let gamesList = localStorage.getItem("games") ? JSON.parse(localStorage.getItem("games")) : [];
let participants = localStorage.getItem("teamdata") ? JSON.parse(localStorage.getItem("teamdata")) : [];

function modalHandle(modalID) {
    let modal = document.querySelector(`#${modalID}`)
    if (modal) {
        modal.classList.toggle('is-active')
    } else console.error("could not find modal of specified ID");
}

function clearLocalStorage() {
    let proceed = confirm("This will clear all table data. This CANNOT be undone. Are you sure you want to continue?")
    if (proceed) {
        localStorage.clear();
        location.reload();
    }
}

function submitEntry(h,a,hs,as,d) {
    console.log("REACHED");
    const home = h.toUpperCase();
    const away = a.toUpperCase();
    const homeScore = Number(hs);
    const awayScore = Number(as);
    const date = d;
    newGame(home, away, homeScore, awayScore, date);
}

function newGame(home, away, homeScore, awayScore, date) {
    const game = {
        date: date,
        home: home,
        away: away,
        homeScore: homeScore,
        awayScore: awayScore,
    }
    trackParticipation(game);
    gamesList.push(game);
    localStorage.setItem("games", JSON.stringify(gamesList));
}

function trackParticipation(game) {
    if (!participants.find((team) => team.name === game.home)) {
        const homeObj = {
            name: game.home,
            W: 0,
            L: 0,
            counter: 0,
            homeGames: {

            },
            awayGames: {

            }
        }
        participants.push(homeObj);
    }
    if (!participants.find((team) => team.name === game.away)) {
        const awayObj = {
            name: game.away,
            counter: 0,
            W: 0,
            L: 0,
            homeGames: {

            },
            awayGames: {

            }
        }
        participants.push(awayObj);
    }
    for (const team of participants) {
        if (team.name === game.home) {
            let id = team.counter;
            team.homeGames[`g${id}`] = game;
            team.counter += 1;
            game.homeScore > game.awayScore ? team.W += 1 : team.L += 1;
        } else if (team.name === game.away) {
            let id = team.counter;
            team.awayGames[`g${id}`] = game;
            team.counter += 1;
            game.homeScore > game.awayScore ? team.L += 1 : team.W += 1;
        }
    }
    localStorage.setItem("teamdata", JSON.stringify(participants))
}

function displayStats() {
    for (const country of participants) {
        let tbody = document.querySelector("#scores-data")

        let teamRow = document.createElement("tr");
        let nameDOM = document.createElement("td");
        let WDOM = document.createElement("td");
        let LDOM = document.createElement("td");
        let PCTDOM = document.createElement("td");

        nameDOM.textContent = country.name;
        let W = country.W
        let L = country.L
        WDOM.textContent = W;
        LDOM.textContent = L;
        PCTDOM.textContent = isFinite(W/(W+L)) ? W/(W+L)*100 : 100;

        tbody.appendChild(teamRow);
        teamRow.appendChild(nameDOM);
        teamRow.appendChild(WDOM);
        teamRow.appendChild(LDOM);
        teamRow.appendChild(PCTDOM);
    }
}

function getAllGames(country) {
    let games = [];
    for (const game of gamesList) {
        if (country === game.home || country == game.away) {
           games.push(game); 
        }
    }
    console.log(games);
    return games;
}

document.addEventListener("DOMContentLoaded", (event) => { displayStats(); });