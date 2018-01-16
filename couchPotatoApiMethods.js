var CouchPotato = require("couchpotato");
const config = require("./config.json");
const cp = new CouchPotato(config.couchPotato.url, config.couchPotato.port);

Promise.all([getKey()]);


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
            console.log("Has key:", result);
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
        prettifiedMovieList += "#" + index + " " + movie.info.original_title + " (" + movie.info.year + ") " + "IMDB: " +
            movie.info.rating.imdb[0] + " " + movie.info.rating.imdb[1] + " votes" + "\n";
    });
    return movieList.length === 0 ? prettifiedMovieList + "0" : prettifiedMovieList;
}