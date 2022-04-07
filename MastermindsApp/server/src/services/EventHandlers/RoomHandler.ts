import { joinRequest } from "../../interfaces/JoinRequest";
import { GameStateService } from "../GameStateService";
import { RoomService } from "../RoomService";
import { SaveGameService } from "../SaveGameService";

const registerGuessHandler = require("./GuessHandler");
const maxUsers = 6;

var saveGameService = new SaveGameService();

module.exports = (io, socket, roomService: RoomService) => {
  socket.on("room:request-room-creation", (nickname) => {
    var roomCode = roomService.GenerateRoomCode();
    var wordSet = roomService.GenerateWordSet(roomCode);
    roomService.roomGameStates[roomCode].setStartingTeam(wordSet);

    registerGuessHandler(io, socket, roomService.roomGameStates);

    if (nickname == "") {
      io.to(socket.id).emit("room:nickname-empty-create");
      return;
    }

    roomService.AddUser(socket.id, nickname, roomCode);

    socket.join(roomCode);

    let rooms = socket.rooms;
    let socketRoomCode = [...rooms][1];
    io.to(socket.id).emit("room:joined-room", roomCode);
    io.to(socketRoomCode).emit("words:generated-set", wordSet);
    io.to(socketRoomCode).emit(
      "team:starting-team",
      roomService.roomGameStates[roomCode].startingTeam
    );
    saveGameService.SaveGames(roomService.roomGameStates);
  });

  socket.on("room:request-to-join", (msg) => {
    let joinRequest: joinRequest = JSON.parse(msg);
    var roomCode = joinRequest.roomCode;
    var nickname = joinRequest.nickname;

    if (nickname == "") {
      io.to(socket.id).emit("room:nickname-empty-join");
      return;
    }

    var roomExists = roomService.GetRoomCode(roomCode);
    if (!roomExists) {
      io.to(socket.id).emit("room:room-does-not-exist");
      return;
    }

    if (roomService.rooms[roomCode].length >= maxUsers) {
      io.to(socket.id).emit("room:max-capacity");
      return;
    }

    var userAdded = roomService.AddUser(socket.id, nickname, roomCode);
    if (!userAdded) {
      io.to(socket.id).emit("room:user-already-exists");
      return;
    }

    socket.join(roomCode);
    registerGuessHandler(io, socket, roomService.roomGameStates);

    var wordSet = roomService.roomGameStates[roomCode].words;

    io.to(socket.id).emit("room:joined-room", roomCode);
    io.to(socket.id).emit("words:generated-set", wordSet);
    io.to(socket.id).emit(
      "turn:updated",
      roomService.roomGameStates[roomCode].gameTurn
    );
  });

  socket.on("changed-role", (role) => {
    io.to(socket.id).emit("role-updated", role);
  });

  socket.on("changed-team", (team) => {
    io.to(socket.id).emit("team-updated", team);
  });

  socket.on("changed-username", (username) => {
    io.to(socket.id).emit("username-updated", username);
  });

  socket.on("game:restart-game", () => {
    let roomCode = [...socket.rooms][1];
    let wordSet = roomService.GenerateWordSet(roomCode);

    roomService.roomGameStates[roomCode].words = wordSet;
    roomService.roomGameStates[roomCode].setStartingTeam(wordSet);

    io.to(roomCode).emit("game:restart-game");
    io.to(roomCode).emit("words:generated-set", wordSet);
    io.to(roomCode).emit(
      "team:starting-team",
      roomService.roomGameStates[roomCode].startingTeam
    );
    io.to(roomCode).emit(
      "turn:updated",
      roomService.roomGameStates[roomCode].gameTurn
    );
    saveGameService.SaveGames(roomService.roomGameStates);

    console.log("Restart game");
  });

  socket.on("disconnect", () => {
    console.log("Removing user: " + socket.id);
    var roomCode = roomService.userRooms[socket.id];
    roomService.RemoveUser(socket.id);

    if (roomService.roomGameStates[roomCode]) {
      io.to(roomCode).emit(
        "game:update-words",
        roomService.roomGameStates[roomCode].words
      );
    }
  });

  socket.on("room:leave", () => {
    console.log("Removing user: " + socket.id);
    var roomCode = roomService.userRooms[socket.id];
    roomService.RemoveUser(socket.id);

    if (roomService.roomGameStates[roomCode]) {
      io.to(roomCode).emit(
        "game:update-words",
        roomService.roomGameStates[roomCode].words
      );
    }
  });
};
