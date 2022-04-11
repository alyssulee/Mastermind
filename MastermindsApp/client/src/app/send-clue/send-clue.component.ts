import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { WordCategory } from '../interfaces/GameWord';
import * as $ from 'jquery';
import { GameStateService } from '../services/game-state.service';
import { Clue, Role, Team, Turn } from '../interfaces/GameLogicInterfaces';

@Component({
  selector: 'app-send-clue',
  templateUrl: './send-clue.component.html',
  styleUrls: ['./send-clue.component.scss'],
})
export class SendClueComponent implements OnInit {
  @ViewChild('clueNumber') numberButton!: ElementRef;
  @ViewChild('numberPopup') numberPopup!: ElementRef;

  clue: Clue = { word: '', number: 1 };

  isMastermind: boolean = false;
  team: Team = Team.None;
  isMyTurn: boolean = false;

  remainingCards: number;
  numberArray: Array<number>;

  constructor(
    private elementRef: ElementRef,
    private gameStateService: GameStateService
  ) {
    this.update(gameStateService);

    // TODO: Update to number of remaining cards when score is implemented.
    this.remainingCards = 9;
    this.numberArray = Array(this.remainingCards)
      .fill(1)
      .map((x, i) => i + 1);
  }

  ngOnInit(): void {
    this.gameStateService.updated().subscribe(() => {
      this.update(this.gameStateService);
      this.clue.user = this.gameStateService.user;
    });
  }

  update(gameStateService: GameStateService): void {
    this.isMastermind = gameStateService.user.role == Role.Mastermind;
    this.team = gameStateService.user.team;
    this.isMyTurn = gameStateService.isMyTurn;
    if (!this.isMyTurn) {
      this.clue.number = 1;
    }

    let newRemaining = 0;
    for (let word of Object.values(this.gameStateService.gameWordSet)) {
      if (word.category.toString() == this.team.toString()) {
        if (!word.guessed) newRemaining++;
      }
    }
    this.remainingCards = newRemaining;
    this.numberArray = Array(this.remainingCards)
    .fill(1)
    .map((x, i) => i + 1);
  }

  onClueNumberChange(value: number): void {
    this.clue.number = value;
    // $(".number-popup").hide();
  }

  onSendClue(): void {
    this.clue.word = String($('#clue-field').val()).trim();
    if (this.clue.word) {
      console.log('SEND CLUE IN COMPONENT');
      this.gameStateService.sendClueEvent(this.clue);
      console.log('Send Clue', JSON.stringify(this.clue));
      $('.error').hide();
    } else {
      $('.error').show();
    }
  }

  togglePopup(): void {
    let numberPopup = $('.number-popup');
    numberPopup.is(':visible') ? numberPopup.hide() : numberPopup.show();
  }

  @HostListener('document:click', ['$event'])
  public onGlobalClick(event: any) {
    if (
      this.numberButton &&
      this.numberButton.nativeElement != event.target &&
      !this.numberPopup.nativeElement.contains(event.target)
    ) {
      $('.number-popup').hide();
    }
  }
}
