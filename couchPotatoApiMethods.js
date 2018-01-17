var CouchPotato = require("couchpotato");
const config = require("./config.json");
const cp = new CouchPotato(config.couchPotato.url, config.couchPotato.port);

Promise.all([getKey().then(function(response) { console.log(response) }).catch(function(error) {
    console.log(error);
})]);


module.exports = {
    listActiveMovies: async function() {
        let response = await promisifyQuery("movie.list", { status: "active" });
        return parseMovieList(response.movies, "Active movies list");
    },
    searchDownloadedMovies: async function(title) {
        let response = await promisifyQuery("movie.list", { status: "done", search: title });
        return parseMovieList(response.movies, "Downloaded movies search result");
    },
    searchWantedMovies: async function() {
        let response = await promisifyQuery("movie.searcher.full_search", null);
        return response;
    },
    addWantedMovie: async function(title, imdbId) {
        let response = await promisifyQuery("movie.add/?identifier=" + imdbId + "&title=" + title +
            "&profile_id=26eaa646031340bd93b705de12e34af3&category_id=-1", null);
        return response;
    },
    searchMovie: async function(title) {
        let response = await promisifyQuery("movie.search/?q=" + title, null);
        return response.movies ? parseMovieListTitles(response.movies) : [];
    },
    keyboardMovieList: function arrayOfOptionsForKeyboard(movieList) {
        let mainArray = [];
        movieList.forEach(movie => {
            let subArray = [];
            subArray.push("*&-" + movie.originalTitle + "->imdbId->" + movie.imdbId);
            mainArray.push(subArray);
        });
        return mainArray;
    }
}



function promisifyQuery(query, options) {
    return new Promise((resolve, reject) => {
        cp.query(query, options, (res, body) => {
            if (!res) {
                return reject("Error en la query");
            }
            resolve(body);
        });
    });
}

function getKey() {
    return new Promise((resolve, reject) => {
        cp.getKey(function(result) {
            if (result) {
                resolve("Has key - true");
            }
            reject("Has key - false");

        })
    });
}

function parseMovieList(movieList, title) {
    let prettifiedMovieList = "--- " + title + " --- \n";
    movieList.forEach((movie, index) => {
        index = index + 1;
        let downloadStatus = movie.releases.length > 0 ? movie.releases[0].status : "not snatched";

        prettifiedMovieList += "#" + index + " " + movie.info.original_title + " (" + movie.info.year + ") " + "IMDB: " +
            movie.info.rating.imdb[0] + " " + movie.info.rating.imdb[1] + " votes" + " Download status: " + downloadStatus + "\n ";
    });
    return movieList.length === 0 ? prettifiedMovieList + "0" : prettifiedMovieList;
}

function parseMovieListTitles(movieList) {
    let movieTitleList = [];
    movieList.forEach((movie, index) => {
        index = index + 1;
        movieTitleList.push({
            index: "#" + index,
            originalTitle: movie.original_title,
            year: "(" + movie.year + ")",
            imdbId: movie.imdb
        })
    });
    return movieTitleList;
}