import { Clue, Guess, Team } from "../../interfaces/GameLogicInterfaces";
import { GameStateService, GuessResult } from "../GameStateService";
import { SaveGameService } from "../SaveGameService";

var saveGameService = new SaveGameService();

module.exports = (
  io,
  socket,
  roomGameStates: { [roomCode: string]: GameStateService }
) => {
  const updateTurn = (roomCode) => {
    roomGameStates[roomCode].updateTurn();
    io.to(roomCode).emit("turn:updated", roomGameStates[roomCode].gameTurn);
  };

  const endGame = (winningTeam, roomCode) => {
    io.to(roomCode).emit("game:end", winningTeam);
    io.emit("game:save");
    saveGameService.SaveGames(roomGameStates);
  };

  socket.on("clue:send-clue", (clue: Clue) => {
    let roomCode = [...socket.rooms][1];
    updateTurn(roomCode);
    roomGameStates[roomCode].setClue(clue);
    console.log("emitting CLUE REGISTERED");
    io.to(roomCode).emit("server:clue-registered", clue);
    saveGameService.SaveGames(roomGameStates);
  });

  socket.on("guess:suggest-word", (guess: Guess) => {
    let roomCode = [...socket.rooms][1];
    roomGameStates[roomCode].SuggestWord(guess);
    io.to(roomCode).emit("game:update-words", roomGameStates[roomCode].words);
  });

  socket.on("guess:unsuggest-word", (guess: Guess) => {
    let roomCode = [...socket.rooms][1];
    roomGameStates[roomCode].UnsuggestWord(guess);
    io.to(roomCode).emit("game:update-words", roomGameStates[roomCode].words);
  });

  socket.on("guess:guess-word", (guess: Guess) => {
    console.log("Guessing word", guess);
    let roomCode = [...socket.rooms][1];
    var guessResult = roomGameStates[roomCode].CheckGuessedWord(guess);
    io.to(roomCode).emit("game:update-words", roomGameStates[roomCode].words);

    switch (guessResult) {
      case GuessResult.Failure:
      case GuessResult.EndTurn:
        roomGameStates[roomCode].ResetSuggestedWords();
        io.to(roomCode).emit(
          "game:update-words",
          roomGameStates[roomCode].words
        );
        updateTurn(roomCode);
        break;
      case GuessResult.LostGame:
        switch (guess.user.team) {
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

    io.to(roomCode).emit("server:word-guess-registered", guess);

    saveGameService.SaveGames(roomGameStates);
  });

  socket.on("guess:end-guessing", (user) => {
    let roomCode = [...socket.rooms][1];

    updateTurn(roomCode);
    roomGameStates[roomCode].ResetSuggestedWords();
    io.to(roomCode).emit("game:update-words", roomGameStates[roomCode].words);

    io.to(roomCode).emit("server:end-guessing", user);
    saveGameService.SaveGames(roomGameStates);
  });
};
