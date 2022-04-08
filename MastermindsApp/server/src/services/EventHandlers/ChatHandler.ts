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

module.exports = (
  io,
  socket,
  roomGameStates: { [roomCode: string]: GameStateService }
) => {
  socket.on("message:new-message", (msg: Message) => {
    console.log("I got it!");
    let roomCode = [...socket.rooms][1];
    io.to(roomCode).emit("message:send-message", msg);

    saveGameService.SaveGames(roomGameStates);
  });
};
