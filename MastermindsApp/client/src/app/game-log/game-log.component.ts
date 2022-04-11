import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Clue,
  Role,
  Team,
  Message,
  HelperMethods,
  Guess,
  User,
} from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';
import * as $ from 'jquery';
import { getLocaleDateFormat } from '@angular/common';
import { GameLogService, LogInfo, LogType } from '../services/game-log.service';

@Component({
  selector: 'app-game-log',
  templateUrl: './game-log.component.html',
  styleUrls: ['./game-log.component.scss'],
})
export class GameLogComponent implements OnInit {
  isMinion: boolean;
  constructor(
    private gameState: GameStateService,
    private logService: GameLogService
  ) {
    this.isMinion = gameState.user.role == Role.Minion;
  }

  ngOnInit(): void {
    this.gameState.updated().subscribe(() => {
      this.isMinion = this.gameState.user.role == Role.Minion;
    });

    this.logService.getLogSubject().subscribe((logInfo: LogInfo) => {
      console.log('game log comp got log:', logInfo);
      if (logInfo.logType == LogType.Clue) {
        let clue = logInfo.clue;
        if (!clue) return;

        let color = HelperMethods.getColorByTeam(clue.user!.team);

        let html =
          '<span style="color: ' +
          HelperMethods.getColorByTeam(Team.None) +
          '; font-weight: bold"><span style="color: ' +
          color +
          ';">' +
          clue.user!.username +
          '</span> gives clue <span style="color: ' +
          color +
          ';">' +
          clue.word.toUpperCase() +
          ' ' +
          clue.number +
          '</span></span>';

        this.addLog(html);
      } else if (logInfo.logType == LogType.Guess) {
        let guess = logInfo.guess;
        if (!guess) return;

        let wordColor = HelperMethods.getColorByCategory(
          guess.gameWord.category
        );
        let teamColor = HelperMethods.getColorByTeam(guess.user.team);

        let html =
          '<span style="color: ' +
          HelperMethods.getColorByTeam(Team.None) +
          '; font-weight: bold; margin-left: 1rem;">  <span style="color: ' +
          teamColor +
          ';">' +
          guess.user.username +
          '</span> guesses <span style="color: ' +
          wordColor +
          ';">' +
          guess.gameWord.word.toUpperCase();
        ('</span></span>');

        this.addLog(html);
      } else if (logInfo.logType == LogType.EndGuessing) {
        let user = logInfo.user;
        if (!user) return;

        let color = HelperMethods.getColorByTeam(user.team);

        let html =
          '<span style="color: ' +
          HelperMethods.getColorByTeam(Team.None) +
          '; font-weight: bold; margin-left: 1rem;">  <span style="color: ' +
          color +
          ';">' +
          user.username +
          '</span> ended their turn.</span>';

        this.addLog(html);
      }
    });

    // TODO: onGuess (Handle bomb  + different colours)
    // TODO: ended turn
  }

  addLog(html: string) {
    let logs: HTMLCollectionOf<Element> =
      document.getElementsByClassName('gameLog-msgs');

    // add to both mobile log and screen log
    for (var index = 0; index < logs.length; index++) {
      let log: Element | null = logs.item(index);

      if (log) {
        // We must create a new item for each log (Elements may not be re-used)
        var item = document.createElement('div');
        item.innerHTML = html;

        log.appendChild(item);
      }
    }
  }

  /* Mobile GameLog Popup */
  MobileOpenGameLog(): void {
    if ($('.game-log').is(':visible')) {
      $('.game-log').hide();
      $('.mobile-overlay-log').hide();
    } else {
      $('.game-log').show();
      $('.mobile-overlay-log').show();
    }
  }

  IsMobile(): boolean {
    return window.innerWidth <= 800;
  }

  @ViewChild('mobileOverlayLog') mobileOverlay!: ElementRef;

  @HostListener('document:click', ['$event'])
  public onGlobalClick(event: any) {
    if (
      this.IsMobile() &&
      this.mobileOverlay &&
      this.mobileOverlay.nativeElement == event.target
    ) {
      $('.game-log').hide();
      $('.mobile-overlay-log').hide();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (!this.IsMobile()) {
      $('.game-log').show();
      $('.mobile-overlay-log').show();
    } else {
      $('.game-log').hide();
      $('.mobile-overlay-log').hide();
    }
  }
}
