export class RoomService 
{
    roomCodes: string [];

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
        return "randomCode";
    }
}