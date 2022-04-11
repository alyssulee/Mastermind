import { Component, Input, OnInit } from '@angular/core';
import { Role, Team, User } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-team-board',
  templateUrl: './team-board.component.html',
  styleUrls: ['./team-board.component.scss'],
})
export class TeamBoardComponent implements OnInit {
  @Input()
  team: Team = Team.None;

  mastermind: Role = Role.Mastermind;
  minion: Role = Role.Minion;

  constructor(
    private gameStateService: GameStateService,
    private roomService: RoomService
  ) {
    // TODO: Check if mastermind is taken on both teams
  }

  ngOnInit(): void {}

  hasTeam(): boolean {
    return this.gameStateService.user.team != Team.None;
  }

  joinMastermind(): void {
    if (!this.mastermindTaken())
      this.gameStateService.setTeamAndRole(this.team, Role.Mastermind);
  }

  joinMinion(): void {
    this.gameStateService.setTeamAndRole(this.team, Role.Minion);
  }

  public mastermindTaken(): boolean {
    return this.getUsers(Role.Mastermind).length > 0;
  }

  getUsers(role: Role): User[] {
    return this.roomService.getUsers(this.team, role);
  }
}
