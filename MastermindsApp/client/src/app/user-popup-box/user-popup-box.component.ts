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
  valueUsername: string;

  constructor(private gameState: GameStateService) {
    this.team = gameState.user.team;
    this.username = gameState.user.username;
    this.valueUsername = this.username;

    if (this.team == Team.Green) {
      this.oppositeColor = Team.Purple;
    } else {
      this.oppositeColor = Team.Green;
    }
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
    if (this.team == Team.Green) {
      this.oppositeColor = Team.Purple;
    } else {
      this.oppositeColor = Team.Green;
    }
  }

  switchTeam() {
    this.gameState.setTeam(this.oppositeColor);
    console.log('this switch team clicked');
    console.log('value of opposite team is' + this.oppositeColor);
  }

  onSubmit() {
    this.gameState.setUsername(this.valueUsername);
  }
}
