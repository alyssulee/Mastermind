/**How to use clickOutside: https://www.npmjs.com/package/ng-click-outside */

import { Component, ElementRef, OnInit } from '@angular/core';
import { Role, Team, Turn, User } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';
import { RoomService } from '../services/room.service';
import { Router } from '@angular/router';

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
  spectator: boolean;

  constructor(
    private router: Router,
    private gameState: GameStateService,
    private roomService: RoomService
  ) {
    this.team = gameState.user.team;
    this.username = gameState.user.username;
    this.valueUsername = this.username;

    if (this.team == Team.Green) {
      this.oppositeColor = Team.Purple;
    } else {
      this.oppositeColor = Team.Green;
    }
    if (
      this.gameState.user.team == Team.None &&
      this.gameState.user.role == Role.None
    ) {
      this.spectator = true;
    } else {
      this.spectator = false;
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
      if (
        this.gameState.user.team == Team.None &&
        this.gameState.user.role == Role.None
      ) {
        this.spectator = true;
      } else {
        this.spectator = false;
      }
    });

    this.roomService.onLeaveRoom().subscribe(() => {
      this.router.navigate(['/login/']);
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
    if (
      this.gameState.user.team == Team.None &&
      this.gameState.user.role == Role.None
    ) {
      this.spectator = true;
    } else {
      this.spectator = false;
    }
  }

  switchTeam() {
    this.gameState.setTeam(this.oppositeColor);
    console.log('this switch team clicked');
    console.log('value of opposite team is' + this.oppositeColor);
    this.gameState.clicked();
  }

  onSubmit() {
    this.gameState.setUsername(this.valueUsername);
    this.gameState.clicked();
  }

  leaveRoom() {
    this.roomService.onRequestToLeave();
  }

  // onClickedOutside(e: Event) {
  //   console.log('You Clicked Outside', e);

  //   this.gameState.clicked();
  // }
  becomeSpectator() {
    this.gameState.setTeamAndRole(Team.None, Role.None);
    this.gameState.clicked();
  }
}
