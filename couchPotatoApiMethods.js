var CouchPotato = require("couchpotato");
const config = require("./config.json");
const cp = new CouchPotato(config.couchPotato.url, config.couchPotato.port);

Promise.all([getKey()]);


module.exports = {
    listActiveMovies: async function() {
        var response = await promisifyQuery("movie.list", { status: "active" });
        return parseMovieList(response.movies);
    }
}



function promisifyQuery(query, options) {
    return new Promise((resolve, reject) => {
        cp.query(query, options, (res, body) => {
            if (!res) {
                console.log("Query result: ".res);
                return reject("Error en la query");
            }
            console.log("Response body: ", body)
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

function parseMovieList(movieList) {
    let prettifiedMovieList = "---Active movies list--- \n";
    movieList.forEach((movie, index) => {
        index = index + 1;
        prettifiedMovieList += "#" + index + " " + movie.info.original_title + " (" + movie.info.year + ") " + "IMDB: " +
            movie.info.rating.imdb[0] + " " + movie.info.rating.imdb[1] + " votes" + "\n";
    });
    return movieList.length === 0 ? prettifiedMovieList + "0" : prettifiedMovieList;
}