const PORT = 8080;

var express = require('express'),
    app = express(), 
    server = require('http').createServer(app),
    io = require('socket.io')(server, { cors: { origin: '*', } }),
    path = require('path');
server.listen(PORT);
console.log("Server Running on Port ", PORT);

const registerWordHandler = require('./services/EventHandlers/WordHandler')
const registerRoomHandler = require('./services/EventHandlers/RoomHandler')
const registerGuessHandler = require('./services/EventHandlers/GuessHandler')

io.on('connection', (socket) => 
{
    console.log(socket.id, ': user connected');

    registerWordHandler(io, socket);
    registerRoomHandler(io, socket);
    registerGuessHandler(io, socket);
});

