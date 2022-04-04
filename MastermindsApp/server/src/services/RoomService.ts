import internal from "stream";
import { GameWord } from "../interfaces/GameWord";
import { GameStateService } from "./GameStateService";
import { WordService } from "./WordService";

export class RoomService 
{
    roomCodes: string [] = [];
    rooms: { [roomCode: string]: string [] } = {};
    roomGameStates: { [roomCode: string]: GameStateService } = {};
    roomCodeLength = 8;

    constructor(private wordService: WordService) { }

    GenerateRoomCode() : string
    {
        let code;
        do {
          code = this.getRandomCode();
        } while (this.roomCodes.includes(code));

        this.roomCodes.push(code);
        this.rooms[code] = [];

        return code;
    }

    GenerateWordSet(code: string) : { [word: string]: GameWord } {
        this.roomGameStates[code] = new GameStateService();
        var wordset = this.wordService.GenerateWordSet();

        wordset.forEach(word => {
            this.roomGameStates[code].words[word.word] = word;
        });

        return this.roomGameStates[code].words;
    }

    getRandomCode() {
        return Array.from(
            { length: this.roomCodeLength },
            () => String.fromCharCode(Math.floor(Math.random() * 26) + 65)
        ).join('');
    }

    GetRoomCode(roomCode: string) : boolean
    {
        return this.roomCodes.includes(roomCode);
    }

    AddUser(nickname: string, roomCode: string) : boolean {
        if(this.rooms[roomCode].includes(nickname)) return false;
        
        this.rooms[roomCode].push(nickname);
        return true;
    }
}