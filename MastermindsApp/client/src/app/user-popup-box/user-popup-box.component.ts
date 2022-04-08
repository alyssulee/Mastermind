import { Component, OnInit } from '@angular/core';
import { Role, Team, Turn, User } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-user-popup-box',
  templateUrl: './user-popup-box.component.html',
  styleUrls: ['./user-popup-box.component.scss'],
})
export class UserPopupBoxComponent implements OnInit {
  team: Team;
  username: string;
  oppositeColor: Team;

  constructor(private gameState: GameStateService) {
    this.team = gameState.user.team;
    this.oppositeColor = gameState.user.team;
    this.username = gameState.user.username;
  }

  ngOnInit(): void {
    this.gameState.updated().subscribe(() => {
      this.update();
      this.username = this.gameState.user.username;
      this.team = this.gameState.user.team;

      if (this.team == Team.Green) {
        this.oppositeColor = Team.Purple;
      } else {
        this.oppositeColor = Team.Green;
      }
    });
  }

  update() {
    this.username = this.gameState.user.username;
    this.team = this.gameState.user.team;
  }
}
