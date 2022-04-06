import { Component, Input, OnInit } from '@angular/core';
import { Guess, Team } from '../interfaces/GameLogicInterfaces';
import { GameWord, WordCategory } from '../interfaces/GameWord';
import { GameStateService } from '../services/game-state.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-mastermind-word-card',
  templateUrl: './mastermind-word-card.component.html',
  styleUrls: ['./mastermind-word-card.component.scss']
})
export class MastermindWordCardComponent implements OnInit {

  @Input() gameWord: GameWord; 

  constructor() { 
    this.gameWord = {word: "", category: WordCategory.Neutral, guessed: false, suggested: []}
  }

  ngOnInit(): void {}
}
