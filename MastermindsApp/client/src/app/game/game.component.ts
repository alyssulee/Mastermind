import { Component, OnInit } from '@angular/core';
import { Role, Team } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  public greenTeam: Team = Team.Green;
  public purpleTeam: Team = Team.Purple;

  isClicked: boolean = false;

  constructor(private router: Router, private gameService: GameStateService) {}

  ngOnInit(): void {
    this.onLoginRedirect().subscribe(() => {
      this.router.navigate(['/login']);
    });
    this.gameService.updated().subscribe(() => {
      this.update();
    });
  }

  hasTeam(): boolean {
    return this.gameService.user.team != Team.None;
  }

  onLoginRedirect() {
    return new Observable((observer) => {
      this.gameService.socket.on('login:redirect', () => {
        observer.next();
      });
    });
  }

  onClickedOutside(e: Event) {
    console.log('You Clicked Outside', e);
    if (e.target == document.getElementById('userPopup')) {
      e.stopPropagation();
    }
    this.gameService.clicked();
  }
  
  update() {
    this.isClicked = this.gameService.isButtonClicked();
  }
}
