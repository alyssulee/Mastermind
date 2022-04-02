import { Guess } from "../../interfaces/GameLogicInterfaces";

module.exports = (io, socket) => {
    socket.on('guess:suggest-word', (guess : Guess) => {
        let roomCode = [...socket.rooms][1];        
        io.to(roomCode).emit('guess:suggest-word', guess);
    });

    socket.on('guess:unsuggest-word', (guess : Guess) => {
        let roomCode = [...socket.rooms][1];
        io.to(roomCode).emit('guess:unsuggest-word', guess);
    });

    socket.on('guess:guess-word', (guess : Guess) => {
        let roomCode = [...socket.rooms][1];
        io.to(roomCode).emit('guess:guess-word', guess);
    });
}