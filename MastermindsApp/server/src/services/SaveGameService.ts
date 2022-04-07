import { GameStateService } from "./GameStateService";

export class SaveGameService 
{
    constructor() { 
    }

    SaveGames(roomGameStates: { [roomCode: string]: GameStateService }) {
        let fs = require('fs');
        let path = require('path');
        fs.writeFileSync(path.join(__dirname, '../data') + '/past-games.json', JSON.stringify(roomGameStates));
    }
}