import { Component, OnInit } from '@angular/core';
import { Team, Role } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-team-options',
  templateUrl: './team-options.component.html',
  styleUrls: ['./team-options.component.scss'],
})
export class TeamOptionsComponent implements OnInit {
  constructor(
    private gameStateService: GameStateService,
    private roomService: RoomService
  ) {
    // TODO: Check if mastermind is taken on both teams
  }

  ngOnInit(): void {}

  updateGreenMastermind(): void {
    if (!this.greenMastermindTaken())
      this.gameStateService.setTeamAndRole(Team.Green, Role.Mastermind);
  }

  updateGreenMinion(): void {
    this.gameStateService.setTeamAndRole(Team.Green, Role.Minion);
  }

  updatePurpleMastermind(): void {
    if (!this.purpleMastermindTaken())
      this.gameStateService.setTeamAndRole(Team.Purple, Role.Mastermind);
  }

  updatePurpleMinion(): void {
    this.gameStateService.setTeamAndRole(Team.Purple, Role.Minion);
  }

  public greenMastermindTaken(): boolean {
    return this.roomService.mastermindTaken.green;
  }

  public purpleMastermindTaken(): boolean {
    return this.roomService.mastermindTaken.purple;
  }
}
