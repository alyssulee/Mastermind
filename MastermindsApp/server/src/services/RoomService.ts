import { GameWord } from "../interfaces/GameWord";
import { GameStateService } from "./GameStateService";
import { WordService } from "./WordService";

export class RoomService 
{
    roomCodes: string [] = [];
    rooms: { [roomCode: string]: string [] } = {};
    roomGameStates: { [roomCode: string]: GameStateService } = {};
    userNames: { [socketId: string]: string } = {};
    userRooms: { [socketId: string]: string } = {};
    roomCodeLength = 8;

    constructor(private wordService: WordService) { 
        this.roomGameStates = this.ReadPreviousGames();
        
        Object.keys(this.roomGameStates).forEach(roomcode => {
            this.rooms[roomcode] = [];
            this.roomCodes.push(roomcode);
        });
    }

    ReadPreviousGames() : { [roomCode: string]: GameStateService }
    {
        let fs = require('fs');
        let path = require('path');
        let text = fs.readFileSync(path.join(__dirname, '../data') + '/past-games.json');
        let json = JSON.parse(text);
        return json;
    }

    SaveGames() {
        let fs = require('fs');
        let path = require('path');
        fs.writeFileSync(path.join(__dirname, '../data') + '/past-games.json', JSON.stringify(this.roomGameStates));
    }

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

        console.log(this.roomGameStates);
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

    AddUser(socketId: string, nickname: string, roomCode: string) : boolean {
        if(this.rooms[roomCode].includes(nickname)) return false;
        
        this.userNames[socketId] = nickname;
        this.userRooms[socketId] = roomCode;
        this.rooms[roomCode].push(nickname);
        return true;
    }

    RemoveUser(socketId: string) {
        var nickname = this.userNames[socketId];
        var roomCode = this.userRooms[socketId];

        if(this.rooms[roomCode] != null && this.rooms[roomCode].includes(nickname)){
            const index = this.rooms[roomCode].indexOf(nickname, 0);
            if (index > -1) {
                this.rooms[roomCode].splice(index, 1);
            }
        }

        if(Object.keys(this.userNames).includes(socketId)){
            delete this.userNames[socketId];
        }
            
        if(Object.keys(this.userRooms).includes(socketId)){
            delete this.userRooms[socketId];
        }
    }
}