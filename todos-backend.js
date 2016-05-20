'use strict';

var mysql = require('mysql');
var express = require('express');

var app = express();
var port = 3000;

var allowCrossDomain = function (req, res, next) {
    console.log("allowCrossDomain: " + req.method);
    res.header('Access-Control-Allow-Origin', '*');
    next();
};
app.use(allowCrossDomain);

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
