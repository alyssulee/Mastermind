const PORT = 8080;

var express = require('express'),
    app = express(), 
    server = require('http').createServer(app),
    io =require('socket.io')(server, {
        cors: {
          origin: '*',
        }
      }),
    path = require('path');
server.listen(PORT);
console.log("Server Running on Port ", PORT);


app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => 
{
    console.log(socket.id, ': user connected');
});