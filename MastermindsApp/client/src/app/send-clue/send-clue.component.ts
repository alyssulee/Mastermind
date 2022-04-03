import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { WordCategory } from '../interfaces/GameWord';
import * as $ from 'jquery';
import { GameStateService } from '../services/game-state.service';
import { Clue, Role, Team } from '../interfaces/GameLogicInterfaces';


@Component({
  selector: 'app-send-clue',
  templateUrl: './send-clue.component.html',
  styleUrls: ['./send-clue.component.scss'],
})
export class SendClueComponent implements OnInit {
  @ViewChild('clueNumber') numberButton!: ElementRef;
  @ViewChild('numberPopup') numberPopup!: ElementRef;

  clue : Clue = {word: "", number: 1}

  isMastermind: boolean = true;   // TODO: Change this to use userService
  team: Team = Team.Green; // TODO: Change this to use userService

  constructor(private elementRef: ElementRef, private gameStateService : GameStateService) { 
    this.isMastermind = gameStateService.role == Role.Mastermind;
    this.team = gameStateService.team;
  }

  ngOnInit(): void { }

  onClueNumberChange(value:number) : void {
    this.clue.number = value;
    // $(".number-popup").hide();
  }

  onSendClue() : void {
    this.clue.word = String($("#clue-field").val()).trim();
    if(this.clue.word)
    {
      this.gameStateService.sendClueEvent(this.clue);
      console.log("Send Clue", JSON.stringify(this.clue));
      $(".error").hide();
    }
    else 
    {
      $(".error").show();
    }
  }

  togglePopup() : void {
    let numberPopup = $(".number-popup")
    numberPopup.is(":visible") ? numberPopup.hide() : numberPopup.show();
  }

  @HostListener('document:click', ['$event'])
  public onGlobalClick(event: any) {
    if(this.numberButton && this.numberButton.nativeElement != event.target 
      && !this.numberPopup.nativeElement.contains(event.target))
    {
      $(".number-popup").hide();
    }
  }

}
