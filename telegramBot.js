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

telegram.onText(/\/searchdownloadedmovies (.+)/, (msg, match) => {
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



telegram.on("text", (message) => {
    console.log(message.chat.id, message.text, new Date(message.date * 1000).toGMTString());
});