import { Component, OnInit } from '@angular/core';
import { Role, Team } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private gameService : GameStateService) { 
  }

  ngOnInit(): void {
  }

  updateGreenMastermind(): void {
    this.gameService.setTeamAndRole(Team.Green, Role.Mastermind);
  }
  updateGreenMinion(): void {
    this.gameService.setTeamAndRole(Team.Green, Role.Minion);
    
  }
  updatePurpleMastermind(): void {
    this.gameService.setTeamAndRole(Team.Purple, Role.Mastermind);
    
  }
  updatePurpleMinion(): void {
    this.gameService.setTeamAndRole(Team.Purple, Role.Minion);
    
  }

}