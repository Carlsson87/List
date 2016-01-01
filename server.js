var app  = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var lists = {};

io.on('connection', function(socket) {

    socket.on('create-list', function(data) {
        console.log('Created list: ' + data.name);
        socket.join(data.name);
    });

    socket.on('subscribe', function(listName) {
        console.log('Subscribed to: ' + listName);
        socket.join(listName);
        io.sockets.in(listName).emit('subscribed');
    });

    socket.on('update-list', function(data) {

    });

    /*
    socket.on('update-list', function(data) {
        io.sockets.in(data.name).emit()
    });*/
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/app.js', function(req, res) {
    res.sendFile(__dirname + '/public/app.js');
});

server.listen(3000, function() {
    console.log('Listening');
});