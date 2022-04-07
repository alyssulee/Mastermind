import { Component, OnInit } from '@angular/core';
import { Role, Team, Turn } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';
@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.scss'],
})
export class UserPopupComponent implements OnInit {
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

    this.team = turn.team;
    return '';
  }
}
