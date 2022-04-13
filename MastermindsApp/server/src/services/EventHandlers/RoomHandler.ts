import {
  LogInfo,
  Role,
  Team,
  User,
} from "../../interfaces/GameLogicInterfaces";
import { joinRequest } from "../../interfaces/JoinRequest";
import { GameStateService } from "../GameStateService";
import { RoomService } from "../RoomService";
import { SaveGameService } from "../SaveGameService";

const registerGuessHandler = require("./GuessHandler");
const registerChatHandler = require("./ChatHandler");
const maxUsers = 6;

var saveGameService = new SaveGameService();

module.exports = (io, socket, roomService: RoomService) => {
  socket.on("room:request-room-creation", (nickname) => {
    var roomCode = roomService.GenerateRoomCode();
    var wordSet = roomService.GenerateWordSet(roomCode);
    roomService.roomGameStates[roomCode].setStartingTeam(wordSet);

    registerGuessHandler(io, socket, roomService.roomGameStates);
    registerChatHandler(io, socket, roomService.roomGameStates);

    if (nickname == "") {
      io.to(socket.id).emit("room:nickname-empty-create");
      return;
    }
    if (nickname.length > 12) {
      io.to(socket.id).emit("room:nickname-long-create");
      return;
    }

    let user = roomService.AddUser(socket.id, nickname, roomCode);

    socket.join(roomCode);

    let rooms = socket.rooms;
    let socketRoomCode = [...rooms][1];

    io.to(socket.id).emit("username-created", user.username);
    io.to(socket.id).emit("room:joined-created-room", roomCode);
    io.to(socketRoomCode).emit("words:generated-set", wordSet);
    io.to(socketRoomCode).emit(
      "team:starting-team",
      roomService.roomGameStates[roomCode].startingTeam
    );
    saveGameService.SaveGames(roomService.roomGameStates);

    io.to(roomCode).emit("room:add-user", user);
  });

  socket.on("room:request-to-join", (msg) => {
    let joinRequest: joinRequest = JSON.parse(msg);
    var roomCode = joinRequest.roomCode;
    var nickname = joinRequest.nickname;

    if (nickname == "") {
      io.to(socket.id).emit("room:nickname-empty-join");
      return;
    }

    if (nickname.length > 12) {
      io.to(socket.id).emit("room:nickname-long-join");
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
    registerChatHandler(io, socket, roomService.roomGameStates);

    var wordSet = roomService.roomGameStates[roomCode].words;

    io.to(socket.id).emit("username-created", userAdded.username);
    io.to(socket.id).emit("room:joined-room", roomCode);
    io.to(socket.id).emit("words:generated-set", wordSet);
    io.to(socket.id).emit(
      "turn:updated",
      roomService.roomGameStates[roomCode].gameTurn
    );

    io.to(roomCode).emit("room:add-user", userAdded);
  });

  socket.on("changed-role", (role: Role) => {
    var user = roomService.GetUser(socket.id);
    user.role = role;
    io.to(user.room).emit("role-updated", user);

    if (
      user.role == Role.Mastermind &&
      user.team != null &&
      user.team != Team.None
    ) {
      io.to(user.room).emit("mastermind-set", user.team);
    }
  });

  socket.on("changed-team", (team: Team) => {
    var user = roomService.GetUser(socket.id);
    user.team = team;
    io.to(user.room).emit("team-updated", user);

    if (user.role == Role.Mastermind) {
      io.to(user.room).emit("mastermind-set", team);
    }
  });

  socket.on("changed-username", (username) => {
    var user = roomService.GetUser(socket.id);
    roomService.roomGameStates[user.room].UpdateUsernameSuggestWords(
      user.username,
      username
    );

    io.to(user.room).emit(
      "game:update-words",
      roomService.roomGameStates[user.room].words
    );

    io.to(user.room).emit("username-updated", {
      oldUsername: user.username,
      username: username,
    });

    user.username = username;
  });

  socket.on("created-username", (username) => {
    io.to(socket.id).emit("username-created", username);
  });

  socket.on("clicked-userpopup", () => {
    io.to(socket.id).emit("clicked-user-popup");
  });

  socket.on("room:check-mastermind-taken", (roomCode) => {
    let data = { purple: false, green: false };

    for (let user of roomService.GetUsers(roomCode)) {
      if (user.role == Role.Mastermind) {
        if (user.team == Team.Green) data.green = true;
        if (user.team == Team.Purple) data.purple = true;
      }
    }

    socket.to(roomCode).emit("mastermind-taken", data);
  });

  socket.on("load-users", (roomCode) => {
    io.to(socket.id).emit("all-users", roomService.GetUsers(roomCode));
  });

  socket.on("load-game-log", (roomCode) => {
    io.to(socket.id).emit("full-game-log", roomService.GetGameLogs(roomCode));
  });

  socket.on("add-game-log", (log: LogInfo) => {
    let roomLog: LogInfo[] = roomService.GetGameLogs(log.roomCode)
    if (roomLog.length > 0 && roomLog[roomLog.length - 1] == log) return;
    roomLog.push(log);
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
    var user: User = roomService.RemoveUser(socket.id);
    if (user == null) return;

    var roomCode = user.room;

    if (roomService.roomGameStates[roomCode]) {
      io.to(roomCode).emit(
        "game:update-words",
        roomService.roomGameStates[roomCode].words
      );
    }

    if (
      user.role == Role.Mastermind &&
      user.team != null &&
      user.team != Team.None
    ) {
      io.to(roomCode).emit("mastermind-unset", user.team);
    }

    io.to(roomCode).emit("room:remove-user", user);
  });

  socket.on("room:leave", () => {
    console.log("Removing user: " + socket.id);
    var user: User = roomService.RemoveUser(socket.id);
    if (user == null) return;

    var roomCode = user.room;
    io.to(socket.id).emit("room: leave-room");

    if (roomService.roomGameStates[roomCode]) {
      io.to(roomCode).emit(
        "game:update-words",
        roomService.roomGameStates[roomCode].words
      );
    }

    if (
      user.role == Role.Mastermind &&
      user.team != null &&
      user.team != Team.None
    ) {
      io.to(roomCode).emit("mastermind-unset", user.team);
    }

    io.to(roomCode).emit("room:remove-user", user);
  });
};
