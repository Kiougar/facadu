var express = require('express');
var app = express();

app.use('/static', express.static(__dirname + '/static'));

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var server = app.listen(5000, 'localhost', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Facadu listening at http://%s:%s',host, port);
});