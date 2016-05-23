'use strict';

var mysql = require('mysql');
var express = require('express');
// interprete del body html in formato json
var bodyParser = require('body-parser');

var app = express();
var port = 3000;

var allowCrossDomain = function (req, res, next) {
    console.log("allowCrossDomain: " + req.method);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
app.use(allowCrossDomain);

// parse application/json
app.use(bodyParser.json());

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todosdb'
});

app.get('/todos', function (req, res) {
    // res.header('Access-Control-Allow-Origin', '*');
    var query = "SELECT * from todos";
    console.log(query);
    connection.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        console.log('rows.length= ' + rows.length);
        res.json(rows);
    });
});

app.get('/todos/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    var query = "SELECT * from todos WHERE id = ?";
    console.log(query);
    connection.query(query, id, function (err, rows, fields) {
        if (err)
            throw err;
        res.json(rows[0]);
    });
});

// vogliamo aggiungere al db il nuovo TODO inserito dall'utente
app.post('/todos', function (req, res) {
    console.log("req.body=", req.body);
    var query = "INSERT INTO todos (descrizione, completato) VALUES (?, ?);";
    console.log(query);
    connection.query(query, [req.body.descrizione, req.body.completato],
            function (err, result) {
                if (err)
                    throw err;
                console.log(result.insertId);
                // eseguo select di questo nuovo oggetto e lo ritorno al client
                var query = "SELECT * from todos WHERE id = ?;";
                console.log(query);
                connection.query(query, result.insertId, function (err, rows, fields) {
                    if (err)
                        throw err;
                    res.json(rows[0]);
                });
            });
});

console.log('Connecting to MySQL...');
connection.connect();
console.log('Connected');

app.listen(port, function () {
    console.log('Express App listening on port 3000! http://localhost:' + port);
});

process.on('exit', function () {
    console.log('Disconnecting from MySQL...');
    connection.end();
    console.log('Disconnected');
});
