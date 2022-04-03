import { Role, Team, Turn } from "../interfaces/GameLogicInterfaces";

export class GameStateService 
{
    gameTurn: Turn;

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
}