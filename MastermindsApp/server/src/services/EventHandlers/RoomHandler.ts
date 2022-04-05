import { joinRequest } from "../../interfaces/JoinRequest";
import { GameStateService } from "../GameStateService";
import { RoomService } from "../RoomService";

const registerGuessHandler = require('./GuessHandler')

module.exports = (io, socket, roomService: RoomService) => {
    socket.on('room:request-room-creation', (nickname) => {
        var roomCode = roomService.GenerateRoomCode();
        var wordSet = roomService.GenerateWordSet(roomCode);
        roomService.roomGameStates[roomCode].setStartingTeam(wordSet);

        registerGuessHandler(io, socket, roomService.roomGameStates[roomCode]);

        if(nickname == ""){
            io.to(socket.id).emit("room:nickname-empty-create");
            return;
        }

        roomService.AddUser(nickname, roomCode);

        socket.join(roomCode);

        let rooms = socket.rooms; 
        let socketRoomCode = [...rooms][1];
        io.to(socket.id).emit("room:joined-room", roomCode);
        io.to(socketRoomCode).emit("words:generated-set", wordSet);
        io.to(socketRoomCode).emit("team:starting-team", roomService.roomGameStates[roomCode].startingTeam);
    });

    socket.on('room:request-to-join', (msg) => {
        let joinRequest:joinRequest = JSON.parse(msg);
        var roomCode = joinRequest.roomCode;
        var nickname = joinRequest.nickname;

        if(nickname == ""){
            io.to(socket.id).emit("room:nickname-empty-join");
            return;
        }

        var roomExists = roomService.GetRoomCode(roomCode);
        if(!roomExists) {   
            io.to(socket.id).emit("room:room-does-not-exist");
            return;
        }

        var userAdded = roomService.AddUser(nickname, roomCode);
        if(!userAdded) {   
            io.to(socket.id).emit("room:user-already-exists");
            return;
        }

        socket.join(roomCode);

        var wordSet = roomService.roomGameStates[roomCode].words;

        let rooms = socket.rooms; 
        let socketRoomCode = [...rooms][1];
        io.to(socket.id).emit("room:joined-room", roomCode);
        io.to(socketRoomCode).emit("words:generated-set", wordSet);
        io.to(socketRoomCode).emit("turn:updated", roomService.roomGameStates[roomCode].gameTurn);
    });

    socket.on('changed-role', (role) => {
        io.to(socket.id).emit("role-updated", role);
    });

    socket.on('changed-team', (team) => {
        io.to(socket.id).emit("team-updated", team);
    });

    socket.on('game:restart-game', () =>{
        let roomCode = [...socket.rooms][1];
        let wordSet = roomService.GenerateWordSet(roomCode);
        roomService.roomGameStates[roomCode].setStartingTeam(wordSet);

        io.to(roomCode).emit("game:restart-game");
        io.to(roomCode).emit("words:generated-set", wordSet);
        io.to(roomCode).emit("team:starting-team", roomService.roomGameStates[roomCode].startingTeam);
        io.to(roomCode).emit("turn:updated", roomService.roomGameStates[roomCode].gameTurn);

        console.log('Restart game');
    });
}