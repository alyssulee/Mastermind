import { Role, Team, Turn, Guess, Clue } from "../interfaces/GameLogicInterfaces";
import { GameWord, WordCategory } from "../interfaces/GameWord";

export enum GuessResult {
    Success = 'Success',
    EndTurn = 'EndTurn',
    Failure = 'Failure',
    LostGame = 'LostGame',
    WonGame = 'WonGame'
  }

export class GameStateService 
{
    gameTurn: Turn;
    endOfGame: boolean = false;
    winningTeam: Team;
    words: { [word: string]: GameWord } = {};
    currentClue: Clue;
    currentAmountOfGuesses: number;

    constructor() 
    { 
        this.gameTurn = {team: Team.Green, role: Role.Mastermind}
    }

    updateTurn() : void {
        if(this.gameTurn.team == Team.Green && this.gameTurn.role == Role.Mastermind) {
            this.gameTurn = {team: Team.Green, role: Role.Minion};
        }
        else if(this.gameTurn.team == Team.Green && this.gameTurn.role == Role.Minion) {
            this.gameTurn = {team: Team.Purple, role: Role.Mastermind};
        }
        else if(this.gameTurn.team == Team.Purple && this.gameTurn.role == Role.Mastermind) {
            this.gameTurn = {team: Team.Purple, role: Role.Minion};
        }
        else {
            this.gameTurn = {team: Team.Green, role: Role.Mastermind}
        }
    }
    
    setClue(clue: Clue){
        this.currentClue = clue;
        this.currentAmountOfGuesses = 0;
    }

    CheckGuessedWord(guess : Guess) : GuessResult {
        switch(guess.gameWord.category){
            case WordCategory.Green:
                switch(guess.user.team){
                    case Team.Green:
                        //Add check for end of turn or won game
                        this.currentAmountOfGuesses++;
                        if(this.currentAmountOfGuesses >= this.currentClue.number){
                            return GuessResult.EndTurn;
                        }
                        
                        return GuessResult.Success;
                    case Team.Purple:
                        return GuessResult.Failure;
                }
            case WordCategory.Purple:
                switch(guess.user.team){
                    case Team.Green:
                        return GuessResult.Failure;
                    case Team.Purple:
                        //Add check for end of turn or won game
                        this.currentAmountOfGuesses++; 
                        if(this.currentAmountOfGuesses >= this.currentClue.number){
                            return GuessResult.EndTurn;
                        }
                        
                        return GuessResult.Success;
                }
            case WordCategory.Neutral:
                return GuessResult.Failure;
            case WordCategory.Bomb:
                return GuessResult.LostGame;
        }
    }
}