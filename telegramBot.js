const TelegramBot = require('node-telegram-bot-api');
const executeCommand = require('./executeCommand.js');
const cp = require('./couchPotatoApiMethods');
var config = require('./config.json');
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

telegram.onText(/\/cpserverstart/, (msg, match) => {
    executeCommand.startCP().then(function(response) {
        telegram.sendMessage(msg.chat.id, "Servidor iniciado");
    }).catch(function(error) {
        telegram.sendMessage(msg.chat.id, error);
    });
});

telegram.onText(/\/cpserverrestart/, (msg, match) => {
    executeCommand.restartCP().then(function(response) {
        telegram.sendMessage(msg.chat.id, "Servidor reiniciado");
    }).catch(function(error) {
        telegram.sendMessage(msg.chat.id, error);
    });
});

telegram.onText(/\/cpserverstop/, (msg, match) => {
    executeCommand.stopCP().then(function(response) {
        telegram.sendMessage(msg.chat.id, "Servidor parado");
    }).catch(function(error) {
        telegram.sendMessage(msg.chat.id, error);
    });
});

telegram.onText(/\/pruebacp/, (msg, match) => {
    cp.pruebaCouch().then(function(response) {
        telegram.sendMessage(msg.chat.id, response);
    }).catch(function(error) {
        telegram.sendMessage(msg.chat.id, error);
    });

});

telegram.on("text", (message) => {
    console.log(message.chat.id, message.text);
    // telegram.sendMessage(message.chat.id, "Hello world");
});