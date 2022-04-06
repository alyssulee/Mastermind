import { convertUpdateArguments } from '@angular/compiler/src/compiler_util/expression_converter';
import { Component, OnInit } from '@angular/core';
import { Team } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent implements OnInit {

  myTeam: Team;
  winningTeam: Team;
  isEndGame: boolean;

  constructor(private gameState : GameStateService) { 
    this.myTeam = gameState.user.team;
    this.winningTeam = gameState.winningTeam;
    this.isEndGame = gameState.endOfGame;
  }

  ngOnInit(): void {
    this.gameState.updated().subscribe(() => {
      this.update(this.gameState);
    });
  }

  update(gameStateService: GameStateService): void {
    this.myTeam = gameStateService.user.team;
    this.winningTeam = gameStateService.winningTeam;
    this.isEndGame = gameStateService.endOfGame;
  }

  onPlayAgainClick(): void
  {
    this.gameState.sendRestartGameEvent();
    console.log("restart game");
  }
}
