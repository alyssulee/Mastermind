import { joinRequest } from "../../interfaces/JoinRequest";
import { GameStateService } from "../GameStateService";
import { RoomService } from "../RoomService";
import { SaveGameService } from "../SaveGameService";
import {
  Clue,
  Guess,
  Team,
  Message,
} from "../../interfaces/GameLogicInterfaces";
import { ChatService } from "../ChatService";

var saveGameService = new SaveGameService();
var lastMessage: Message;

module.exports = (
  io,
  socket,
  roomGameStates: { [roomCode: string]: GameStateService }
) => {
  socket.on("message:new-message", (msg: Message) => {
    console.log("Received Message", msg);
    if (lastMessage == msg) return;
    let roomCode = [...socket.rooms][1];
    io.to(roomCode).emit("message:send-message", msg);
    roomGameStates[roomCode].clientMessages.push(msg);
    saveGameService.SaveGames(roomGameStates);
    lastMessage = msg;
  });

  socket.on("message:send-messages", () => {
    let roomCode = [...socket.rooms][1];
    io.to(roomCode).emit("message:client-messages", roomGameStates[roomCode].clientMessages);
    saveGameService.SaveGames(roomGameStates);
  });
};
