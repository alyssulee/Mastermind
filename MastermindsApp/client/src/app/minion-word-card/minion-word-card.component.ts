import { Component, Input, OnInit } from '@angular/core';
import { GameWord, WordCategory } from '../interfaces/GameWord';
import * as $ from 'jquery';
import { GameStateService } from '../services/game-state.service';
import { Guess, Team } from '../interfaces/GameLogicInterfaces';

@Component({
  selector: 'app-minion-word-card',
  templateUrl: './minion-word-card.component.html',
  styleUrls: ['./minion-word-card.component.scss']
})
export class MinionWordCardComponent implements OnInit 
{
  @Input() gameWord: GameWord; 
  selfUsername: string;
  notSelfUsername: string;
  team: Team;
  isMyTurn: boolean;

  constructor(private gameState : GameStateService) { 
    this.gameWord = {word: "", category: WordCategory.Neutral, guessed: false}
    this.selfUsername = gameState.username;
    this.notSelfUsername = ""
    this.team = gameState.team;
    this.isMyTurn = gameState.isMyTurn;
  }

  ngOnInit(): void 
  {
     // Subscribe
     this.gameState.onSuggestEvent().subscribe((guess: Guess) => {
      if(this.gameWord.word == guess.gameWord.word && this.selfUsername != guess.username)
      {
        this.notSelfUsername = guess.username;
        $(`#${this.gameWord.word}-card .suggest-name.not-self`).show();
      }
    });

    this.gameState.onUnsuggestEvent().subscribe((guess: Guess) => {
      if(this.gameWord.word == guess.gameWord.word && this.selfUsername != guess.username)
      {
        this.notSelfUsername = guess.username;
        $(`#${this.gameWord.word}-card .suggest-name.not-self`).hide();
      }
    });

    this.gameState.onGuessEvent().subscribe((guess: Guess) => {
      if(this.gameWord.word == guess.gameWord.word)
      {
        // Hide suggest names and add guessed class
        $(`.${this.gameWord.word}-card`).addClass('guessed');
        $(`#${this.gameWord.word}-card .suggest-name.self`).hide();
        $(`#${this.gameWord.word}-card .suggest-name.not-self`).hide();
        this.gameWord.guessed = true;
      }
    });
  }

  onMinionCardClick(): void 
  {
    let suggestName = $(`#${this.gameWord.word}-card .suggest-name.self`);
    let guess: Guess = {gameWord: this.gameWord, username: this.selfUsername}
    if(suggestName.is(":visible"))
    {
      this.gameState.sendUnsuggestEvent(guess)
      suggestName.hide();
    }
    else 
    {
      this.gameState.sendSuggestEvent(guess)
      suggestName.show(); 
    }
  }

  onGuessButtonClick(): void 
  {
    this.gameWord.guessed = true;
    let guess: Guess = {gameWord: this.gameWord, username: this.selfUsername}
    this.gameState.sendGuessEvent(guess);
  }

}