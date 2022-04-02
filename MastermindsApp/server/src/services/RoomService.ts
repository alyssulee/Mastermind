import internal from "stream";

export class RoomService 
{
    roomCodes: string [] = [];
    rooms: { [roomCode: string]: string [] } = {};
    roomCodeLength = 8;

    constructor() 
    { 
        // this.roomCodes = this.ReadRoomCodeFile();
    }

    // private ReadRoomCodeFile() : string []
    // {
    //     let fs = require('fs');
    //     let path = require('path');
    //     let text = fs.readFileSync(path.join(__dirname, '../data') + '/wordlist.txt', 'utf8');
    //     let textByLine = text.split("\r\n")
    //     return textByLine;
    // }

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