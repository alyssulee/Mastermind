import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Clue, Role, Team, Message } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';
import * as $ from 'jquery'; 

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


  /* Mobile GameLog Popup */
  MobileOpenGameLog() : void {
    if($('.game-log').is(":visible")) {
      $('.game-log').hide();
      $('.mobile-overlay-log').hide();
    }
    else {
      $('.game-log').show();
      $('.mobile-overlay-log').show();
    }
  }

  IsMobile() : boolean {
    return ( ( window.innerWidth <= 800 ));
  }

  @ViewChild('mobileOverlayLog') mobileOverlay!: ElementRef;

  @HostListener('document:click', ['$event'])
  public onGlobalClick(event: any) {
    if(this.IsMobile() && this.mobileOverlay && this.mobileOverlay.nativeElement == event.target )
    {
      $('.game-log').hide();
      $('.mobile-overlay-log').hide();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if(!this.IsMobile())
    {
      $('.game-log').show();
      $('.mobile-overlay-log').show();
    }
    else {
      $('.game-log').hide();
      $('.mobile-overlay-log').hide();
    }
  }
}
