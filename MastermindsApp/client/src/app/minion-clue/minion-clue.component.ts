import { Component, OnInit } from '@angular/core';
import { Clue, Role, Team } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-minion-clue',
  templateUrl: './minion-clue.component.html',
  styleUrls: ['./minion-clue.component.scss']
})
export class MinionClueComponent implements OnInit {
  clue: Clue = {word: "clue", number: 3}

  isMastermind: boolean;
  team: Team; 
  isMyTurn: boolean;

  constructor(private gameState : GameStateService) { 
    this.isMastermind = gameState.role == Role.Mastermind;
    this.team = gameState.team;
    this.isMyTurn = gameState.isMyTurn
  }

  ngOnInit(): void {
    this.gameState.onEndGuessingEvent().subscribe(() => {
      console.log("End Guessing");
    });
  }

  onEndGuessing() : void {
    this.gameState.endGuessingEvent();
  }
}
