import { Component, Input, OnInit } from '@angular/core';
import { Role, Team, User } from '../interfaces/GameLogicInterfaces';
import { WordCategory } from '../interfaces/GameWord';
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

  guessed = 0;
  remaining = 7;

  constructor(
    private gameStateService: GameStateService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.gameStateService.updated().subscribe(() => {
      let newGuessed = 0;
      let newRemaining = 7;

      for (let word of Object.values(this.gameStateService.gameWordSet)) {
        if (word.category.toString() == this.team.toString()) {
          if (word.guessed) newGuessed++;
          else newRemaining++;
        }
      }

      this.guessed = newGuessed;
      this.remaining = newRemaining;
    });
  }

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
