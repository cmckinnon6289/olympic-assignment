/*
* FUNCTIONALITY FOR: index.html AND stats.html
*/


let gamesList = localStorage.getItem("games") ? JSON.parse(localStorage.getItem("games")) : []; // gets the list of games from the local storage. if there's no stored games, make a new empty array.
let participants = localStorage.getItem("teamdata") ? JSON.parse(localStorage.getItem("teamdata")) : []; // gets the list of participants from the local storage. if there's no stored participants, make a new empty array.

/**
 * Toggles the specified modal.
 * @param {String} modalID 
 */
function modalHandle(modalID) {
    let modal = document.querySelector(`#${modalID}`) // gets the modal
    if (modal) { // if a modal of the specified ID exists
        modal.classList.toggle('is-active') // toggle the "is-active" class (to open or close it)
    } else console.error("could not find modal of specified ID"); // otherwise, throw an error
}

/**
 * Clears the local storage after user prompt. Used for the "clear local storage" button on index.html. 
 */ 
function clearLocalStorage() { 
    let proceed = confirm("This will clear all data. This CANNOT be undone. Are you sure you want to continue?") // warns the user of the consequences of clearing the localStorage
    if (proceed) { // if the user wants to proceed after being prompted
        localStorage.clear(); // clears localStorage
        location.reload(); // reloads the page
    }
}

class Country { // country class
    constructor(nameO, W, L, PCT, counter, homeGames, awayGames) { // constructor for the class
        this.name = nameO; // "name" was deprecated so i had to make it nameO.
        this.W = W ? W : 0; // number of wins is W (if specified) or 0
        this.L = L ? L : 0; // number of losses is L (if specified) or 0
        this.PCT = PCT ? PCT : 0; // win percentage is PCT (if specified) or 0
        this.counter = counter ? counter : 0; // game counter is counter (if specified) or 0
        this.homeGames = homeGames instanceof Object ? homeGames : {}; // dictionary of home games is homeGames (if it is an instance of Object) or a clean dictionary
        this.awayGames = awayGames instanceof Object ? awayGames : {}; // dictionary of away games is awayGames (if it is an instance of Object) or a clean dictionary
    }
}

class Game { // game class
    constructor(date,home,away,homeScore,awayScore) { // constructor for the class
        this.date = date; // date of the game
        this.home = home; // home team
        this.away = away; // away team
        this.homeScore = homeScore; // home team score
        this.awayScore = awayScore; // away team score
    }
}

/**
 * Get the information for a country.
 * @param {String} countryPassed 
 * @returns an instance of Country
 */
function getCountryData(countryPassed) { // get data for a specified country
    return participants.find((country) => country.name === countryPassed); // return the desired Country object foundin the participants array
}

/**
 * Sanitises and submits a new game entry.
 * 
 * @param {String} h (home team name)
 * @param {String} a (away team name)
 * @param {Number} hs (home team score)
 * @param {Number} as (away team score)
 * @param {String} d (date of the game) 
 */
function submitEntry(h,a,hs,as,d) {
    const home = h.toUpperCase(); // converts h to uppercase
    const away = a.toUpperCase(); // converts a to uppercase
    const homeScore = Number(hs); // converts hs to a number
    const awayScore = Number(as); // converts as to a number
    const date = d; // date
    newGame(home, away, homeScore, awayScore, date); // cre
}

/**
 * Creates a new Game object, adds it to the list of games, and updates the participating countries' stats.
*/
function newGame(home, away, homeScore, awayScore, date) {
    const game = new Game(date,home,away,homeScore,awayScore); // creates a new Game object with the game information
    trackParticipation(game); // adds the game to the team's record and updates relevant statistics
    gamesList.push(game); // adds the game to the list of games
    localStorage.setItem("games", JSON.stringify(gamesList)); // updates the localStorage entry for "games"
}

/**
 * Updates country statistics given a game object, creating a new Country object if needed.
 * @param {Game} game 
 */
function trackParticipation(game) {
    if (!participants.find((team) => team.name === game.home)) { // if the home team isn't already indexed in the participants array
        const homeObj = new Country(game.home); // make a new country object for it!
        participants.push(homeObj); // push that to the array
    }
    if (!participants.find((team) => team.name === game.away)) { // ALL CODE SAME AS ABOVE BUT FOR THE AWAY TEAM.
        const awayObj = new Country(game.away);
        participants.push(awayObj);
    }
    for (const team of participants) { // for every indexed team
        if (team.name === game.home) { // if this was the home team
            let id = team.counter; // this game id is the value of the home team's counter
            team.homeGames[`g${id}`] = game; // add this game to the team's home games with the value of id
            team.counter += 1; // add 1 to the counter
            game.homeScore > game.awayScore ? team.W += 1 : team.L += 1; // if they won, add 1 to W, otherwise add 1 to L
        } else if (team.name === game.away) { // ALL CODE SAME AS ABOVE BUT FOR AWAY GAMES.
            let id = team.counter;
            team.awayGames[`g${id}`] = game;
            team.counter += 1;
            game.homeScore > game.awayScore ? team.L += 1 : team.W += 1;
        }
        team.PCT = isFinite(team.W/(team.W+team.L)) ? team.W/(team.W+team.L)*100 : 100 // update the win percentage of the team. isFinite protects against situations with 1 win and 0 losses, creating Infinity.
    }
    localStorage.setItem("teamdata", JSON.stringify(participants)) // update the localStorage entry for "participants".
}

/**
 * Displays the statistics for all indexed teams.
 */
function displayStats() {
    let tbody = document.querySelector("#scores-data") // gets the team table body
    tbody.innerHTML = ''; // clears it so new data can be displayed
    for (const country of participants) { // for each indexed country
        let teamRow = document.createElement("tr"); // make a new table row
        let nameParentDOM = document.createElement("td"); // add a parent element for its name
        let nameDOM = document.createElement("a"); // add a link element for its name
        let WDOM = document.createElement("td"); // add an element for its Ws
        let LDOM = document.createElement("td"); // add an element for its Ls
        let PCTDOM = document.createElement("td"); // add an element for its PCT

        nameParentDOM.appendChild(nameDOM) // append the element for the team's name to the appropriate parent element

        nameDOM.textContent = country.name; // the text content for the name element is the country's name
        nameDOM.setAttribute("href",`/stats.html?country=${country.name}`) // sets the link attribute to stats.html with a URLSearchParam of the country's name.
        WDOM.textContent = country.W; // W element's text content is the country's Ws
        LDOM.textContent = country.L; // L element's text content is the country's Ls
        PCTDOM.textContent = country.PCT; // PCT element's text content is the country's PCT

        tbody.appendChild(teamRow); // append the row to the table's body
        teamRow.appendChild(nameParentDOM); // append the name parent element to the row
        teamRow.appendChild(WDOM); // append the W element to the row
        teamRow.appendChild(LDOM); // append the L element to the row
        teamRow.appendChild(PCTDOM); // append the PCT element to the row
        teamRow.setAttribute("id",country.name); // set the id of the row to the country's name
    }
}

/**
 * Handles a sorting call. Sorts the table and displays the new stats.
 * @param {Element} elem 
 */
function sortCall(elem) {
    let order = elem.getAttribute("order") === "na" ? "highest" : elem.getAttribute("order"); // get the sorting order. if none exists, it's highest. otherwise, it's what is specified in the element "elem".
    let stat = elem.getAttribute("val"); // get what statistic we are sorting by.
    sortTeamTable(stat,order); // sort the table based on the input
    displayStats(); // display the newly sorted statistics
    elem.setAttribute("order", order === "highest" ? "lowest" : "highest") // swap the order to sort by.
}

/**
 * Sorts the table by the given statistic in the specified order.
 * @param {String} stat 
 * @param {String} order 
 */
function sortTeamTable(stat,order) {
    let stats = ["country","W","L","PCT"] // list of valid statistics to sort by
    let orders = ["highest","lowest"] // list of valid orders to sort by
    let sortBy = stats.includes(stat.toLowerCase()) ? stat : "PCT" // ensures the statistic is valid. if not, the default is the win percentage.
    let atTop = orders.includes(order.toLowerCase()) ? order : "highest" // ensures the order is valid. if not, the default is highest value at the top.
    
    if (atTop === "lowest") { // if the lowest should be at the top
        if (typeof participants[0][sortBy] === "number") { // if the statistic is a number
            participants.sort((a,b) => a[sortBy] - b[sortBy]) // sort by getting the difference
        } else participants.sort((a,b) => a[sortBy] > b[sortBy]) // otherwise see what is greater
    } else { // ALL CODE SAME AS ABOVE BUT FOR THE ORDER WHICH REQUIRES THE HIGHEST VALUE TO BE AT THE TOP OF THE TABLE
        if (typeof participants[0][sortBy] === "number") {
            participants.sort((a,b) => b[sortBy] - a[sortBy])
        } else participants.sort((a,b) => b[sortBy] > a[sortBy])
    }
}

/**
 * Returns all matching games given search parameters.
 * 
 * @param {String} country - The country whose games are being searched.
 * @param {Array} dates - Start and end dates to get a range from (Date objects).
 * @param {String} searchBy - What to use from the parameters (ie: country, dates, or both).
 * 
 * @returns an {Array} of game objects.
 */
function getAllGames(country,dates,searchBy) {
    // searchby values = country, dates, both
    let games = []; // this is the array of games that will be displayed
    if (searchBy === "country" || searchBy == "both") { // if both search queries were selected OR just the "country" query was selected
        for (const game of gamesList) { // for each game in the game list
            if (country === game.home || country == game.away) // if the specified country played in the game
                games.push(game); // add it to the games array
        }
    } else if (searchBy === "dates") { // if ONLY the "dates" search query was selected
        let range = parseDates(dates[0], dates[dates.length-1]); // get a range of dates based on what was specified by the user
        for (const game of gamesList) { // for every game in the game list
            if (range.includes(game.date)) // if the date range includes the date of the game
                games.push(game); // add it to the games array
        }
    }
    if (searchBy === "both") { // if BOTH search queries were selected
        let range = parseDates(dates[0], dates[dates.length-1]); // get a range of dates based on what was specified by the user
        for (let i = 0; i < games.length; i++) { // for each game in the games array
            if (!range.includes(games[i].date)) // if the game does NOT fall on a date included in the date array
                games.splice(i,1); // remove it from the array of games to be displayed
        }
    }
    return games; // return the array
}

/**
 * Returns a range of dates between startDate and endDate.
 * @param {String} startDate
 * @param {String} endDate 
 * @returns {Array} an array of dates in YYYY-MM-DD format.
 */
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
    if (searchSelector === "dates") {
        valid = new Date(dateRange[0]) < new Date(dateRange[dateRange.length-1]);
    } else if (searchSelector === "country") {
        valid = country != null;
    } else if (searchSelector === "both") {
        valid = new Date(dateRange[0]) < new Date(dateRange[dateRange.length-1]) && country != null;
    }
    if (valid) {
        let games = getAllGames(country.toUpperCase(),dateRange,searchSelector).length > 0 ? getAllGames(country.toUpperCase(),dateRange,searchSelector) : "Nothing found.";
        insert.innerHTML = "";
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
        notice.textContent = " Please amend your search and try again.";
        insert.appendChild(notice);
    }
}

document.addEventListener("DOMContentLoaded", (event) => { 
    if (window.location.pathname == "/index.html")
        sortCall(document.querySelector("#three"))
    else if (window.location.pathname == "/stats.html")
        displayCountryInfoSP();
});

document.addEventListener("submit", (event) => {
    if (event.target == document.querySelector("#team-search")) {
        event.preventDefault();
        document.querySelector("#team-search").reset()
        console.log(event);
    }
})

/*
*
*
*
*
*
* FUNCTIONALITY FOR: stats.html
*
*
*
*
*
*
*/

let hg = []; // array of home games being displayed on the page
let ag = []; // same as above for away games

function title() {
    document.title = `${getCountryParamSP() ? getCountryParamSP() : "UNKNOWN"} Statistics`; // title of the page
}

function getCountryParamSP() {
    return new URLSearchParams(window.location.search).get("country"); // get country from URL using URLSearchParams. makes a new URLSearchParams object, then gets the "country" value from that URLSearchParams object and returns it to whatever is calling the function.
}

function displayCountryInfoSP() {
    let country = getCountryData(getCountryParamSP()); // get all the data for the country.
    getGamesSP(country); // sets up ag and hg, sets up pagination on the page, AND displays the games (omg)

    let name = document.querySelector("#name"); // gets the big name header element at the top of the page
    name.textContent = `Country information for ${country.name}`; // sets the text content of the big name header element at the top of the page

    let info = document.querySelector("#info") // gets the info paragrah element just below the big name header element at the top of the page but above the columns of games
    info.textContent = `${country.name} has ${country.W} wins and ${country.L} losses, with a win percentage of ${country.PCT}%.` // sets the text content of the info paragrah element just below the big name header element at the top of the page but above the columns of games
}

function getGamesSP(country) {
    hg = []; // clears HG of all the games previously being displayed
    ag = []; // same as above but for AG
    for (const key in country.homeGames) { // gets all the keys in the homeGames object
        if (Object.hasOwnProperty.call(country.homeGames, key)) { // if the key isnt empty then continue
            const game = country.homeGames[key]; // get the game object given the key
            hg.push(game); // push the game to hg
        }
    }
    // all same as above but for away games (ag)
    for (const key in country.awayGames) {
        if (Object.hasOwnProperty.call(country.awayGames, key)) {
            const game = country.awayGames[key];
            ag.push(game);
        }
    }
    pagSetup() // setup pagination
}

let maxPerPage = 10; // maximum number of games per page
/**
 * Sets up pagination on stats.html.
 */
function pagSetup() {
    let homePar = document.querySelector("#home") // gets the "home" column div
    let awayPar = document.querySelector("#away") // gets the "away" column div
    
    // home pagination
    let numberPagesHome = Math.ceil(hg.length/maxPerPage); // calculates the number of pages in the pagination based on the number of games to be displayed divided by the maximum number of games per page. this number is rounded up to ensure all games can be displayed within the confines of the maximum number of games per page.
    let pageParentHome = document.createElement("nav"); // creates the pagination parent element for the home games column. this will contain all instances of pagination.
    pageParentHome.classList.add("pagination"); // adds the "pagination" class to the pagination parent element.
    pageParentHome.classList.add("is-centered"); // adds the "is-centered" class to the pagination parent element. this ensures that it is centered off with the "home" column div.
    homePar.appendChild(pageParentHome); // appends the pagination to the home column div.
    
    let buttonsParentHome = document.createElement("ul"); // creates the parent for all the pagination buttons
    pageParentHome.appendChild(buttonsParentHome); // appends this button parent to the pagination parent element for the home games column.
    buttonsParentHome.classList.add("pagination-list"); // adds the "pagination-list" class to the button parent.
    for (i=1; i<=numberPagesHome; i++) { // create (numberPagesHome) buttons.
        let buttonParent = document.createElement("li"); // creates a new parent element for a pagination button.
        buttonsParentHome.append(buttonParent); // append that button to the button parent.
        
        let button = document.createElement("a"); // creates a pagination button. 
        button.classList.add("pagination-link"); // adds the "pagination-link" class to the button.
        button.setAttribute("id",`p${i}`); // sets the id of the button to "p${i}", where i is the page number.
        button.setAttribute("page",i); // sets the "page" attribute of the button to i, where i is the page number. this is used later on for a function call.
        button.setAttribute("aria-label",`Goto page ${i}`); // this sets the Accessible Rich Internet Applications label to "Goto page ${i}", where i is the page number. this is used so that those who use screen readers can accurately understand what this button is for.
        button.setAttribute("onclick",`pagDisplay('home',(document.querySelector(\"#p${i}\").getAttribute(\"page\")-1)*${maxPerPage},(document.querySelector(\"#p${i}\").getAttribute(\"page\")*${maxPerPage}))`) // sets the functionality of the button.
        button.textContent = i; // sets the text content to i, where i is the page number.
        buttonParent.appendChild(button); // appends the parent element for this pagination button to the parent for all buttons.
    } // closes the above loop.
    buttonsParentHome.querySelector("#p1").classList.add("is-current"); // makes the button for the first page the current page button by adding the "is-current" class to it.
    
    // away pagination
    // ALL CODE SAME AS ABOVE BUT FOR AWAY GAMES. i rlly dont wanna do that again.
    let numberPagesAway = Math.ceil(ag.length/maxPerPage);
    let pageParentAway = document.createElement("nav");
    pageParentAway.classList.add("pagination");
    pageParentAway.classList.add("is-centered");
    awayPar.appendChild(pageParentAway);

    let buttonsParentAway = document.createElement("ul");
    pageParentAway.appendChild(buttonsParentAway);
    buttonsParentAway.classList.add("pagination-list");
    for (i=1; i<=numberPagesAway; i++) {
        let buttonParent = document.createElement("li");
        buttonsParentAway.append(buttonParent);

        let button = document.createElement("a");
        button.classList.add("pagination-link");
        button.setAttribute("id",`p${i}`);
        button.setAttribute("page",i);
        button.setAttribute("aria-label",`Goto page ${i}`);
        button.setAttribute("onclick",`pagDisplay('away',(document.querySelector(\"#p${i}\").getAttribute(\"page\")-1)*${maxPerPage},(document.querySelector(\"#p${i}\").getAttribute(\"page\")*${maxPerPage}))`)
        button.textContent = i;
        buttonParent.appendChild(button);
    }
    buttonsParentAway.querySelector("#p1").classList.add("is-current");
    
    pagDisplay("home",0,maxPerPage-1) // display the first 5 home games
    pagDisplay("away",0,maxPerPage-1) // display the first 5 away games
}

function pagDisplay(portion,start,end) {
    if (portion === "home") { // portion selects whether to update the home games or the away games.
        let j = 1; // counter for the home games.
        let homePar = document.querySelector("#home-cards") // gets the element with id "home-cards"
        homePar.innerHTML = ''; // clears the home cards.
        for (i = start; i < (end <= hg.length ? end : hg.length); i++) { // start at "start", continue until end OR the length of HG, whichever is smaller.
            let game = hg[i]; // gets the game at index i of the home games array
            homePar.innerHTML += `<div class='card'><div class='card-content'><div class='content'><b class='title is-4'>Home game ${j}</b><br><p>${game.home} vs ${game.away}</p><div class='columns'><div class='column is-one-third'><b>${game.home} score</b><br><p>${game.homeScore}</p></div><div class='column is-one-third'><b>${game.away} score</b><br><p>${game.awayScore}</p></div><div class='column is-one-third'><b>Date of game</b><br><p>${game.date}</p></div>` // makes a new card with game information.
            j++; // increases the counter by 1.
        }
        
    } else if (portion === "away") { // CODE BELOW IS SAME AS ABOVE BUT FOR HOME GAMES.
        let j = 1;
        let awayPar = document.querySelector("#away-cards")
        awayPar.innerHTML = '';
        for (i = start; i < (end <= hg.length ? end : ag.length); i++) { // start at "start", continue until end OR the length of HG, whichever is smaller.
            let game = ag[i];
            awayPar.innerHTML += `<div class='card'><div class='card-content'><div class='content'><b class='title is-4'>Away game ${j}</b><br><p>${game.home} vs ${game.away}</p><div class='columns'><div class='column is-one-third'><b>${game.home} score</b><br><p>${game.homeScore}</p></div><div class='column is-one-third'><b>${game.away} score</b><br><p>${game.awayScore}</p></div><div class='column is-one-third'><b>Date of game</b><br><p>${game.date}</p></div>`
            j++;
        }
    } else console.error("invalid pagDisplay portion (ie: not 'home' or 'away'). fix it!!") // if portion is not "home" or "away", throw an error!
}