import { Clue, Guess } from "../../interfaces/GameLogicInterfaces";

module.exports = (io, socket) => {
    socket.on('clue:send-clue', (clue: Clue) => {
        let roomCode = [...socket.rooms][1];    
        io.to(roomCode).emit('clue:send-clue', clue);
    });

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

    socket.on('guess:end-guessing', () => {
        let roomCode = [...socket.rooms][1];
        io.to(roomCode).emit('guess:end-guessing');
    });
}