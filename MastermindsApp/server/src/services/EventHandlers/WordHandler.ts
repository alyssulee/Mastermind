import { WordService } from "../WordService";

var wordService = new WordService();

module.exports = (io, socket) => {
    const generateWordSet = (roomCode : string) => {
        let wordSet = wordService.GenerateWordSet();
        io.to(roomCode).emit("words:generated-set", wordSet);
    }
  
    socket.on("words:generate-set", generateWordSet);
}