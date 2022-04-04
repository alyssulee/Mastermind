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
    startingTeam: Team;

    constructor() {}

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

    setStartingTeam(words: { [word: string]: GameWord }){
        var greenWords = 0;
        var purpleWords = 0;
        Object.values(words).forEach(word => {
            if(word.category == WordCategory.Green) greenWords++;
            if(word.category == WordCategory.Purple) purpleWords++;
        })

        var team = Team.Purple;
        if(greenWords > purpleWords) team = Team.Green;

        this.startingTeam = team;
        this.gameTurn = {team: team, role: Role.Mastermind};
    }
    
    setClue(clue: Clue){
        this.currentClue = clue;
        this.currentAmountOfGuesses = 0;
    }

    CheckGuessedWord(guess : Guess) : GuessResult {
        this.words[guess.gameWord.word].guessed = true;
        console.log(guess.gameWord.category);
        console.log(guess.user.team);

        var hasWon = this.CheckForWinner(guess.user.team);

        if(hasWon != null) return hasWon;

        switch(guess.gameWord.category){
            case WordCategory.Green:
                switch(guess.user.team){
                    case Team.Green:
                        //Add check for end of turn or won game
                        this.currentAmountOfGuesses++;

                        console.log(this.currentAmountOfGuesses);
                        console.log(this.currentClue.number);
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
    
    CheckForWinner(team: Team){
        var greenTeamWon = true;
        var purpleTeamWon = true;
        Object.values(this.words).forEach(word => {
            if(word.category == WordCategory.Green && word.guessed == false){
                greenTeamWon = false;
            }

            if(word.category == WordCategory.Purple && word.guessed == false){
                purpleTeamWon = false;
            }
        });

        switch(team){
            case Team.Green:
                if(greenTeamWon) return GuessResult.WonGame;
                if(purpleTeamWon) return GuessResult.LostGame;
                break;
            case Team.Purple:
                if(purpleTeamWon) return GuessResult.WonGame;
                if(greenTeamWon) return GuessResult.LostGame;
                break;
        }

        return null;
    }
}