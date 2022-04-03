import { convertUpdateArguments } from '@angular/compiler/src/compiler_util/expression_converter';
import { Component, OnInit } from '@angular/core';
import { Role } from '../interfaces/GameLogicInterfaces';
import { GameWord } from '../interfaces/GameWord';
import {GameStateService} from '../services/game-state.service'

@Component({
  selector: 'app-word-grid',
  templateUrl: './word-grid.component.html',
  styleUrls: ['./word-grid.component.scss']
})
export class WordGridComponent implements OnInit {
  isMastermind: boolean;
  gameWordSet : GameWord [] = [];

  constructor( private gameStateService : GameStateService) { 
    gameStateService.sendGenerateWordEvent();
    this.isMastermind = gameStateService.user.role == Role.Mastermind;
    this.gameWordSet = gameStateService.gameWordSet;
  }

  ngOnInit(): void {
    // Subscribe
    this.gameStateService.onGeneratedWordSet().subscribe((words : GameWord[]) => {
      this.gameStateService.setWords(words);
      this.gameWordSet = this.gameStateService.gameWordSet;
    });

    this.gameStateService.updated().subscribe(() => {
      this.update(this.gameStateService);
    });
  }
  
  update(gameStateService : GameStateService) : void {
    this.isMastermind = gameStateService.user.role == Role.Mastermind;
    this.gameWordSet = gameStateService.gameWordSet;
  }
}
