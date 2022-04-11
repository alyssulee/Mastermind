import { GameStateService } from "./GameStateService";

export class GameRetrieverService 
{
    constructor() { 
    }

    ReadPreviousGames() : { [roomCode: string]: GameStateService }
    {
        let fs = require('fs');
        let path = require('path');
        let text = fs.readFileSync(path.join(__dirname, '../data') + '/past-games.json');
        let json = JSON.parse(text);

        let gameStates : { [roomCode: string]: GameStateService } = {};
        Object.keys(json).forEach((roomcode) => {
            let gameState = new GameStateService();
            Object.assign(gameState, json[roomcode]);
      
            gameStates[roomcode] = gameState;
        });

        return gameStates;
    }
}