import { Component, OnInit } from '@angular/core';
import { Clue, Role, Team } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  isMastermind: boolean;
  constructor(private gameState: GameStateService) {
    this.isMastermind = gameState.user.role == Role.Mastermind;
  }

  ngOnInit(): void {}
}


