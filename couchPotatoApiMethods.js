// CouchPotato

const CouchPotato = require('couchpotato');
const cp = new CouchPotato("127.0.0.1", 5050);

Promise.all([getKey()]);


module.exports = {
    pruebaCouch: async function() {
        return await promisifyQuery('app.available', null);
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
            resolve(JSON.stringify(body));
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