import { Component, OnInit } from '@angular/core';
import { Role, Team } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private router: Router, private gameService : GameStateService) { 
  }

  ngOnInit(): void {
    this.onLoginRedirect().subscribe(() => {
      this.router.navigate(['/login']);
  });
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

  onLoginRedirect () {
    return new Observable(observer => {
      this.gameService.socket.on('login:redirect', () => {
        observer.next();
      });
    });
  }
}