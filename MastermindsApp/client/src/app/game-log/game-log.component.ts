import { Component, OnInit } from '@angular/core';
import { Clue, Role, Team, Message } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-game-log',
  templateUrl: './game-log.component.html',
  styleUrls: ['./game-log.component.scss'],
})
export class GameLogComponent implements OnInit {
  isMinion: boolean;
  constructor(private gameState: GameStateService) {
    this.isMinion = gameState.user.role == Role.Minion;
  }

  ngOnInit(): void {
    this.gameState.updated().subscribe(() => {
      this.isMinion = this.gameState.user.role == Role.Minion;
    });
  }
}
