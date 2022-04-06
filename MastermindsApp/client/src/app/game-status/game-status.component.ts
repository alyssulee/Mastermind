import { Component, OnInit } from '@angular/core';
import { Role, Team, Turn } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-game-status',
  templateUrl: './game-status.component.html',
  styleUrls: ['./game-status.component.scss']
})
export class GameStatusComponent implements OnInit {

  team: Team; 
  status: string;

  constructor(private gameState : GameStateService) { 
    this.status = this.getStatus(gameState);
    this.team = gameState.user.team;
  }

  ngOnInit(): void {
    this.gameState.updated().subscribe(() => {
      this.update(this.gameState);
    });
  }

  update(gameStateService: GameStateService){
    this.status = this.getStatus(gameStateService);
  }

  getStatus(gameState: GameStateService) : string {
    var turn = gameState.turn;
    var team = gameState.user.team;
    var role = gameState.user.role;
    var isMyTurn = gameState.isMyTurn;

    this.team = turn.team;

    if(gameState.endOfGame){
      return `Game Over! ${gameState.winningTeam} Team Wins`;
    }

    if(isMyTurn){
      switch(role){
        case "Mastermind":
          return "Create a Clue for your Team";
        case "Minion":
          return "Guess a Word";
      }
    }
    else if (turn.team == team){
      switch(role){
        case "Mastermind":
          return "Wait for your Team to Guess";
        case "Minion":
          return "Wait for your Mastermind to give a clue";
      }
    } else {
      return ("It's the " + this.team + " Team's Turn");
    }

    return "";
  }
}