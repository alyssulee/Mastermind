import { Component, OnInit } from '@angular/core';
import { Role, Team, Turn, User } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';
@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.scss'],
})
export class UserPopupComponent implements OnInit {
  team: Team;
  username: string;

  constructor(private gameState: GameStateService) {
    this.team = gameState.user.team;
    this.username = gameState.user.username;
  }

  ngOnInit(): void {
    this.gameState.updated().subscribe(() => {
      this.update();
    });
  }

  update() {
    this.username = this.gameState.user.username;
    this.team = this.gameState.user.team;
  }
}
