import { joinRequest } from "../../interfaces/JoinRequest";

const registerGuessHandler = require('./GuessHandler');
const maxUsers = 6;

module.exports = (io, socket, roomService) => {
    socket.on('room:request-room-creation', (nickname) => {
        var roomCode = roomService.GenerateRoomCode();
        var wordSet = roomService.GenerateWordSet(roomCode);
        roomService.roomGameStates[roomCode].setStartingTeam(wordSet);

        registerGuessHandler(io, socket, roomService.roomGameStates[roomCode]);

        if(nickname == ""){
            io.to(socket.id).emit("room:nickname-empty-create");
            return;
        }

        roomService.AddUser(socket.id, nickname, roomCode);

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

        if(roomService.rooms[roomCode].length >= maxUsers){
            io.to(socket.id).emit("room:max-capacity");
            return;
        }

        var userAdded = roomService.AddUser(socket.id, nickname, roomCode);
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

    socket.on('game:reset', (roomCode) => {
        var wordSet = roomService.GenerateWordSet(roomCode);
        roomService.roomGameStates[roomCode].setStartingTeam(wordSet);

        let rooms = socket.rooms; 
        let socketRoomCode = [...rooms][1];
        io.to(socketRoomCode).emit("words:generated-set", wordSet);
        io.to(socketRoomCode).emit("team:starting-team", roomService.roomGameStates[roomCode].startingTeam);
    });
    
    socket.on('disconnect', () => {
        console.log("Removing user: " + socket.id);
        roomService.RemoveUser(socket.id);
    });

    socket.on('room:leave', () => {
        console.log("Removing user: " + socket.id);
        roomService.RemoveUser(socket.id);
    });
}