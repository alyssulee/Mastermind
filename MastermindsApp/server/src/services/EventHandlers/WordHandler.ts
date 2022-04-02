import { WordService } from "../WordService";

var wordService = new WordService();

module.exports = (io, socket) => {
    const generateWordSet = () => {
        let rooms = socket.rooms; 
        let roomCode = [...rooms][1];
        let wordSet = wordService.GenerateWordSet();

        io.to(roomCode).emit("words:generated-set", wordSet);
    }
  
    socket.on("words:generate-set", generateWordSet);
}