// richiede il modulo http fornito con Node.js e 
// lo rende accessibile attraverso la variabile http
// da qualche parte all'interno di Node.js esiste un modulo 
// denominato "http"
var http = require('http');

// create http server
http.createServer(function (request, response) {
    console.log("Request received.");
    // content header
    response.writeHead(200, {'content-type': 'text/plain'});
    // write message and signal communication is complete
    response.end("Hello, World!\n");
}).listen(8126);

console.log('Server running on 8126');