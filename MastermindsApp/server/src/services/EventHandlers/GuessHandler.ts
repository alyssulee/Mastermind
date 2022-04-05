import { Clue, Guess, Team } from "../../interfaces/GameLogicInterfaces";
import { GameStateService, GuessResult } from "../GameStateService";

module.exports = (io, socket, roomGameStates: GameStateService[]) => {
    const updateTurn = (roomCode) => {
        roomGameStates[roomCode].updateTurn();
        io.to(roomCode).emit('turn:updated', roomGameStates[roomCode].gameTurn);
    }

    const endGame = (winningTeam, roomCode) => {
        io.to(roomCode).emit('game:end', winningTeam);
    }

    socket.on('clue:send-clue', (clue: Clue) => {
        let roomCode = [...socket.rooms][1];
        updateTurn(roomCode);
        roomGameStates[roomCode].setClue(clue);
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
        console.log("Guessing word", guess);
        let roomCode = [...socket.rooms][1];
        console.log(roomCode);
        var guessResult = roomGameStates[roomCode].CheckGuessedWord(guess);
        console.log(guessResult);
        io.to(roomCode).emit('guess:guess-word', guess);

        switch(guessResult){
            case GuessResult.Failure:
            case GuessResult.EndTurn:
                updateTurn(roomCode);
                break;
            case GuessResult.LostGame:
                switch(guess.user.team){
                    case Team.Green:
                        endGame(Team.Purple, roomCode);
                        break;
                    case Team.Purple:
                        endGame(Team.Green, roomCode);
                        break;
                }
                break;
            case GuessResult.WonGame:
                endGame(guess.user.team, roomCode);
                break;
        }

    });

    socket.on('guess:end-guessing', () => {
        let roomCode = [...socket.rooms][1];
        updateTurn(roomCode);
        io.to(roomCode).emit('guess:end-guessing');
    });
}