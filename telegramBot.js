const TelegramBot = require("node-telegram-bot-api");
const executeCommand = require("./executeCommand.js");
const couchPotato = require("./couchPotatoApiMethods");
var config = require("./config.json");
const telegram = new TelegramBot(config.telegram.apiKey, { polling: true });


telegram.onText(/\/cpserverstatus/, (msg, match) => {
    executeCommand.checkCPserviceStatus().then(function(response) {
        telegram.sendMessage(msg.chat.id, "El servidor está corriendo");
        console.log("Response: ", response);
    }).catch(function(error) {
        telegram.sendMessage(msg.chat.id, "El servidor no está corriendo");
        console.log("Error: ", error);
    });

});

telegram.onText(/\/\bcpserverstart\b/, (msg, match) => {
    executeCommand.startCP().then(function(response) {
        telegram.sendMessage(msg.chat.id, "Servidor iniciado");
    }).catch(function(error) {
        telegram.sendMessage(msg.chat.id, error);
    });
});

telegram.onText(/\/\bcpserverrestart\b/, (msg, match) => {
    executeCommand.restartCP().then(function(response) {
        telegram.sendMessage(msg.chat.id, "Servidor reiniciado");
    }).catch(function(error) {
        telegram.sendMessage(msg.chat.id, error);
    });
});

telegram.onText(/\/\bcpserverstop\b/, (msg, match) => {
    executeCommand.stopCP().then(function(response) {
        telegram.sendMessage(msg.chat.id, "Servidor parado");
    }).catch(function(error) {
        telegram.sendMessage(msg.chat.id, error);
    });
});

telegram.onText(/\/\blistactivemovies\b/, (msg, match) => {
    couchPotato.listActiveMovies().then(function(response) {
        telegram.sendMessage(msg.chat.id, response);
    }).catch(function(error) {
        telegram.sendMessage(msg.chat.id, error.message);
    });
});

telegram.onText(/\/\bsearchdownloadedmovies\b (.+)/, (msg, match) => {
    couchPotato.searchDownloadedMovies(match[1]).then(function(response) {
        telegram.sendMessage(msg.chat.id, response);
    }).catch(function(error) {
        telegram.sendMessage(msg.chat.id, error.message);
    });
});

telegram.onText(/\/\bsearchwantedmovies\b/, (msg, match) => {
    couchPotato.searchWantedMovies().then(function(response) {
        telegram.sendMessage(msg.chat.id, "Search of wanted movies started");
    }).catch(function(error) {
        telegram.sendMessage(msg.chat.id, error.message);
    });
});

telegram.onText(/\/\bsearchmovie\b (.+)/, (msg, match) => {
    couchPotato.searchMovie(match[1]).then(function(response) {
        if (response.length > 0) {
            telegram.sendMessage(msg.chat.id, "--- Matching movie titles --- \n", {
                reply_markup: {
                    keyboard: couchPotato.keyboardMovieList(response)
                }
            });
        } else {
            telegram.sendMessage(msg.chat.id, "No movies found with title: " + match[1]);
        }
    }).catch(function(error) {
        telegram.sendMessage(msg.chat.id, error.message);
    });
});

telegram.onText(/\*&-(.+)/, (msg, match) => {
    let title = match[1].split("->")[0];
    let imdbId = match[1].split("->")[2];
    couchPotato.addWantedMovie(title, imdbId).then(function(response) {
        let text = "Added movie: " + response.movie.info.original_title + " (" + response.movie.info.year + ")";
        telegram.sendMessage(msg.chat.id, text, {
            reply_markup: {
                hide_keyboard: true
            }
        });
    }).catch(function(error) {
        telegram.sendMessage(msg.chat.id, error.message);
    });
});


telegram.on("text", (message) => {
    console.log(message.chat.id, message.text, new Date(message.date * 1000).toGMTString());
});