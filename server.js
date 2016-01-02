var app  = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require('redis');
var redisClient = redis.createClient();

io.on('connection', function(socket) {
    console.log('A User Connected');

    socket.on('subscribe', function(list) {
        console.log('Subscribed to ' + list);
        socket.join(list);
        redisClient.exists(list, function(err, exists) {
            if (exists === 1) {
                redisClient.get(list, function(err, value) {
                    socket.emit('subscribed', JSON.parse(value));
                });
            } else {
                var emptyList = [{ text: 'Check this', done: false }];
                redisClient.set(list, JSON.stringify(emptyList), function(err, reply) {
                    socket.emit('subscribed', emptyList);
                });
            }
        });
    });

    socket.on('add item', function(item) {
        redisClient.get(item[0], function(err, value) {
            var list = JSON.parse(value);
            list.push(item[1]);
            io.sockets.in(item[0]).emit('updated list', list);
            redisClient.set(item[0], JSON.stringify(list));
        });
    });

    socket.on('toggle item', function(item) {
        redisClient.get(item[0], function(err, value) {
            var list = JSON.parse(value);
            list[item[1]].done = !list[item[1]].done;
            io.sockets.in(item[0]).emit('updated list', list);
            redisClient.set(item[0], JSON.stringify(list));
        });
    });
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