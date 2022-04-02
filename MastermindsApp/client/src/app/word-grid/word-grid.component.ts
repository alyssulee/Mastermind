import { Component, OnInit } from '@angular/core';
import { GameWord } from '../interfaces/GameWord';
import {GameStateService} from '../services/game-state.service'

@Component({
  selector: 'app-word-grid',
  templateUrl: './word-grid.component.html',
  styleUrls: ['./word-grid.component.scss']
})
export class WordGridComponent implements OnInit {
  gameWordSet : GameWord [] = [];

  constructor( private gameStateService : GameStateService) { 
    gameStateService.sendGenerateWordEvent();
  }

  ngOnInit(): void {
    this.gameStateService.onGeneratedWordSet().subscribe((words : GameWord[]) => {
      this.gameWordSet = words;
      console.log('got a msg: ' + words);
    });
  }

}