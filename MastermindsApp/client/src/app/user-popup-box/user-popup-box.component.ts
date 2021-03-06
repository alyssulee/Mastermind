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
  displayUsernameError: boolean;
  displaySwitchTeamError: boolean;
  displayEmptyUsernameError: boolean;

  constructor(
    private router: Router,
    private gameState: GameStateService,
    private roomService: RoomService
  ) {
    this.team = gameState.user.team;
    this.username = gameState.user.username;
    this.valueUsername = this.username;
    this.displayUsernameError = false;
    this.displaySwitchTeamError = false;
    this.displayEmptyUsernameError = false;

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
      window.location.reload();
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
    var OtherTeamMinions = this.roomService.getUsers(
      this.oppositeColor,
      Role.Minion
    );

    var OtherTeamMastermind = this.roomService.getUsers(
      this.oppositeColor,
      Role.Mastermind
    );

    console.log(OtherTeamMastermind.length);
    if (OtherTeamMastermind.length < 1) {
      this.gameState.setTeamAndRole(this.oppositeColor, Role.Mastermind);
      this.gameState.clicked();
    } else if (OtherTeamMinions.length > 1) {
      this.displaySwitchTeamError = true;
    } else {
      this.gameState.setTeamAndRole(this.oppositeColor, Role.Minion);
      console.log('this switch team clicked');
      console.log('value of opposite team is' + this.oppositeColor);
      this.gameState.clicked();
    }
  }

  onSubmit() {
    if (this.valueUsername.length > 12) {
      this.displayUsernameError = true;
    } else if (this.valueUsername === '') {
      this.displayEmptyUsernameError = true;
    } else {
      this.gameState.setUsername(this.valueUsername);
      this.gameState.clicked();
    }
  }

  leaveRoom() {
    this.roomService.onRequestToLeave();
    this.gameState.clicked();
  }

  becomeSpectator() {
    this.gameState.setTeamAndRole(Team.None, Role.None);
    this.gameState.clicked();
  }
}
