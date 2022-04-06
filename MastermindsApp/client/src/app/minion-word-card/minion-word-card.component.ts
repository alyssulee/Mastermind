import { Component, Input, OnInit } from '@angular/core';
import { GameWord, WordCategory } from '../interfaces/GameWord';
import * as $ from 'jquery';
import { GameStateService } from '../services/game-state.service';
import { Guess, Team, User } from '../interfaces/GameLogicInterfaces';

@Component({
  selector: 'app-minion-word-card',
  templateUrl: './minion-word-card.component.html',
  styleUrls: ['./minion-word-card.component.scss']
})
export class MinionWordCardComponent implements OnInit 
{
  @Input() gameWord: GameWord; 
  user: User;
  isMyTurn: boolean;

  constructor(private gameState : GameStateService) { 
    this.update(gameState);
    this.gameWord = {word: "", category: WordCategory.Neutral, guessed: false, suggested: [] as User[]}
    this.user = gameState.user;
    this.isMyTurn = gameState.isMyTurn;
  }

  ngOnInit(): void 
  {
    this.gameState.updated().subscribe(() => {
      this.update(this.gameState);
    });
  }

  onMinionCardClick(): void 
  {
    let suggestName = $(`#${this.gameWord.word}-card .suggest-name.self`);
    let guess: Guess = {gameWord: this.gameWord, user: this.user}

    if(this.gameWord.suggested.some(e => e.username === this.user.username))
    {
      this.gameState.sendUnsuggestEvent(guess)
    }
    else 
    {
      this.gameState.sendSuggestEvent(guess)
    }
  }

  onGuessButtonClick(): void 
  {
    this.gameWord.guessed = true;
    let guess: Guess = {gameWord: this.gameWord, user: this.user}
    this.gameState.sendGuessEvent(guess);
  }

  update(gameState : GameStateService): void {
    this.user = gameState.user;
    this.isMyTurn = gameState.isMyTurn;
  }
}
