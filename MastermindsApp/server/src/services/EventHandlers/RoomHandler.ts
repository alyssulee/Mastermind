import { join } from "path";
import { joinRequest } from "../../interfaces/JoinRequest";
import { RoomService } from "../RoomService";

var roomService = new RoomService();

module.exports = (io, socket) => {
    socket.on('room:request-room-creation', (nickname) => {
        var roomCode = roomService.GenerateRoomCode();

        if(nickname == ""){
            io.to(socket.id).emit("room:nickname-empty-create");
            return;
        }

        roomService.AddUser(nickname, roomCode);

        socket.join(roomCode);

        io.to(socket.id).emit("room:joined-room", roomCode);
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

        io.to(socket.id).emit("room:joined-room", roomCode);
    });
}