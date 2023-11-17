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

function getAllGames(country,dates,searchBy) {
    // searchby values = country, dates, both
    let games = [];
    if (searchBy === "country" || searchBy == "both") {
        for (const game of gamesList) {
            console.log(game.date);
            if (country === game.home || country == game.away) {
            games.push(game); 
            }
        }
    } else if (searchBy === "dates") {
        let range = parseDates(dates[0], dates[dates.length-1]);
        for (const game of gamesList) {
            if (range.includes(game.date)) {
            games.push(game); 
            }
        }
    }
    if (searchBy === "both") {
        let range = parseDates(dates[0], dates[dates.length-1]);
        for (let i = 0; i < games.length; i++) {
            if (!range.includes(games[i].date)){
                console.log(`range: ${range}. game date: ${games[i].date}.`)
                games.splice(i,1);
            }
        }
    }
    return games;
}

function parseDates(startDate, endDate) { // this function written in part by ChatGPT using the prompt "how to get an array of dates between two given dates in javascript"
    let range = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= new Date(endDate)) {
        range.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    for (let i = 0; i<range.length; i++) { // this loop written by me
        range[i] = `${range[i].getFullYear()}-${range[i].getMonth()}-${range[i].getDate()}`
    }

    return range;
}

function displayGames(country,dateRange,searchSelector) {
    let valid = true;
    let insert = document.querySelector("#found-games");
    if (searchSelector === "dates" || searchSelector === "both") {
        valid = new Date(dateRange[0]) < new Date(dateRange[dateRange.length-1]);
    }
    if (valid) {
        let games = getAllGames(country.toUpperCase(),dateRange,searchSelector).length > 0 ? getAllGames(country.toUpperCase(),dateRange,searchSelector) : "Nothing found.";
        insert.innerHTML = "";
        console.log(games);
        let i = 1;
        if (games instanceof Array) {
            for (const game of games) {
                insert.innerHTML += `<div class='card'><div class='card-content'><div class='content'><b class='title is-4'>Game ${i}</b><br><p>${game.home} vs ${game.away}</p><div class='columns'><div class='column is-one-third'><b>${game.home} score</b><br><p>${game.homeScore}</p></div><div class='column is-one-third'><b>${game.away} score</b><br><p>${game.awayScore}</p></div><div class='column is-one-third'><b>Date of game</b><br><p>${game.date}</p></div>`
                i++;
            }
        } else {
            let notice = document.createElement("b");
            notice.textContent = games;
            insert.appendChild(notice);
        }
    } else {
        let notice = document.createElement("b");
        notice.textContent = "Please amend your date range and try again.";
        insert.appendChild(notice);
    }
}

document.addEventListener("DOMContentLoaded", (event) => { displayStats(); });
document.addEventListener("submit", (event) => {
    if (event.target == document.querySelector("#team-search")) {
        event.preventDefault();
        document.querySelector("#team-search").reset()
        console.log(event);
    }
})