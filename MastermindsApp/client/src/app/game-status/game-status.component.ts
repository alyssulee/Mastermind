import { Component, OnInit } from '@angular/core';
import { Role, Team, Turn } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-game-status',
  templateUrl: './game-status.component.html',
  styleUrls: ['./game-status.component.scss'],
})
export class GameStatusComponent implements OnInit {
  team: Team;
  status: string;

  constructor(private gameState: GameStateService) {
    this.status = this.getStatus();
    this.team = gameState.user.team;
  }

  ngOnInit(): void {
    this.gameState.updated().subscribe(() => {
      this.update();
    });
  }

  update() {
    this.status = this.getStatus();
  }

  getStatus(): string {
    var turn = this.gameState.turn;
    var team = this.gameState.user.team;
    var role = this.gameState.user.role;
    var isMyTurn = this.gameState.isMyTurn;

    this.team = turn.team;

    if (this.gameState.endOfGame) {
      return `Game Over! ${this.gameState.winningTeam} Team Wins`;
    }

    if (
      this.gameState.user.team == Team.None &&
      this.gameState.user.role == Role.None
    ) {
      this.team = Team.None;
      return 'Join a Team!';
    } else if (isMyTurn) {
      switch (role) {
        case 'Mastermind':
          return 'Create a Clue for your Team';
        case 'Minion':
          return 'Guess a Word';
      }
    } else if (turn.team == team) {
      switch (role) {
        case 'Mastermind':
          return 'Wait for your Team to Guess';
        case 'Minion':
          return 'Wait for your Mastermind to give a clue';
      }
    } else {
      return "It's the " + this.team + " Team's Turn";
    }

    return '';
  }
}
