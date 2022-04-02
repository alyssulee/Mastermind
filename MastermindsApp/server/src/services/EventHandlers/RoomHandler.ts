import { RoomService } from "../RoomService";

var roomService = new RoomService();

module.exports = (io, socket) => {
    socket.on('room:request-room-creation', () => {
        var roomCode = roomService.GenerateRoomCode();
        socket.join(roomCode);
        io.to(roomCode).emit("room:room-created", roomCode);
    });
}