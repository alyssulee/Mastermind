import { Role, Team, Turn, Guess, Clue, Message } from "../interfaces/GameLogicInterfaces";
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
    clientMessages : Message[] = []

    constructor() {
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

    SuggestWord(guess: Guess) : void {
        this.words[guess.gameWord.word].suggested.push(guess.user);
    }

    UnsuggestWord(guess: Guess) : void {
        this.words[guess.gameWord.word].suggested = this.words[guess.gameWord.word].suggested.filter(user => user.username !== guess.user.username);
    }

    ResetSuggestedWords() : void {
        Object.values(this.words).forEach(word => {
            word.suggested = [];
        });
    }

    RemoveUserFromSuggestedWords(username: string): void{
        Object.values(this.words).forEach(word => {
            this.words[word.word].suggested = this.words[word.word].suggested.filter(user => user.username !== username);
        });
    }

    CheckGuessedWord(guess : Guess) : GuessResult {
        this.words[guess.gameWord.word].guessed = true;
        this.words[guess.gameWord.word].suggested = [];

        var hasWon = this.CheckForWinner(guess.user.team);

        if(hasWon != null) {
            this.endOfGame = true;
            return hasWon;
        }

        let result;
        switch(guess.gameWord.category){
            case WordCategory.Green:
                switch(guess.user.team){
                    case Team.Green:
                        //Add check for end of turn or won game
                        this.currentAmountOfGuesses++;
                        if(this.currentAmountOfGuesses >= this.currentClue.number){
                            result = GuessResult.EndTurn;
                            break;
                        }
                        
                        result = GuessResult.Success;
                        break;
                    case Team.Purple:
                        result = GuessResult.Failure;
                        break;
                }
                break;
            case WordCategory.Purple:
                switch(guess.user.team){
                    case Team.Green:
                        result = GuessResult.Failure;
                        break;
                    case Team.Purple:
                        //Add check for end of turn or won game
                        this.currentAmountOfGuesses++; 
                        if(this.currentAmountOfGuesses >= this.currentClue.number){
                            result = GuessResult.EndTurn;
                            break;
                        }
                        
                        result = GuessResult.Success;
                        break;
                }
                break;
            case WordCategory.Neutral:
                result = GuessResult.Failure;
                break;
            case WordCategory.Bomb:
                result = GuessResult.LostGame;
                break;
        }

        return result;
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
                if(greenTeamWon) {
                    this.winningTeam = Team.Green;
                    return GuessResult.WonGame;
                }
                if(purpleTeamWon) {
                    this.winningTeam = Team.Purple;
                    return GuessResult.LostGame;
                }
                break;
            case Team.Purple:
                if(purpleTeamWon) {
                    this.winningTeam = Team.Purple;
                    return GuessResult.WonGame;
                }
                if(greenTeamWon){
                    this.winningTeam = Team.Green;
                    return GuessResult.LostGame;
                }
                break;
        }

        return null;
    }
}