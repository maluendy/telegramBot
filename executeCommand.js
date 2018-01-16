//Ejecutar procesos Linux
const exec = require("child_process").exec;

module.exports = {
    checkCPserviceStatus: async function() {
        return await promisifyChildProcess("service couchpotato status");
    },

    startCP: async function() {
        return await promisifyChildProcess("sudo service couchpotato start");
    },
    restartCP: async function() {
        return await promisifyChildProcess("sudo service couchpotato restart");
    },
    stopCP: async function() {
        return await promisifyChildProcess("sudo service couchpotato stop");
    }
}

function promisifyChildProcess(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) return reject(error.message);
            if (stderr) return reject(stderr);
            resolve(stdout);
        });
    });
}