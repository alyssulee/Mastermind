import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import MobileSize, {
  Clue,
  Role,
  Team,
  Message,
} from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';
import { ChatService } from '../services/chat.service';
import { ElementRef } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  message: string = '';
  isMastermind: boolean;
  username: string;
  team: Team;
  isMinion: boolean;
  constructor(
    private chatService: ChatService,
    private gameState: GameStateService,
    private elementRef: ElementRef
  ) {
    this.isMastermind = gameState.user.role == Role.Mastermind;
    this.username = gameState.user.username;
    this.team = gameState.user.team;
    this.isMinion = gameState.user.role == Role.Minion;
  }

  ngOnInit(): void {
    this.chatService.updated().subscribe((msg: Message) => {
      this.outputMessage(msg);
      var chatMessages =
        this.elementRef.nativeElement.querySelector('.chat-msg');
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
    this.chatService.clientMessagesReceived().subscribe((msgs: Message[]) => {
      const myNode = document.querySelector('.chat-msg');

      if (myNode) {
        myNode!.textContent = '';
      }

      for (var i = 0; i < msgs.length; i++) {
        this.outputMessage(msgs[i]);
        var chatMessages =
          this.elementRef.nativeElement.querySelector('.chat-msg');
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });

    this.gameState.updated().subscribe(() => {
      this.isMinion = this.gameState.user.role == Role.Minion;
      this.team = this.gameState.user.team;
    });
  }

  sendMessage() {
    if (this.message === '') return;
    let msg: Message = {
      username: this.gameState.user.username,
      msg: this.message,
      team: this.gameState.user.team,
    };
    this.message = '';
    this.chatService.sendMessage(msg);
  }

  outputMessage(msg: Message) {
    var chatMessages = this.elementRef.nativeElement.querySelector('.chat-msg');
    //Create a new div element
    const div = document.createElement('div');
    //Add the class message to the div
    div.classList.add('msg-container');
    div.classList.add('right');

    var msgColor: string;
    if (msg.team == Team.Purple) {
      msgColor = '#b264f2';
    } else {
      msgColor = '#4cc36d';
    }

    if (msg.team == this.gameState.user.team) {
      if (msg.username == this.gameState.user.username) {
        div.innerHTML = `
        <p class="msg" style = "border-radius: 10px;background-color: ${msgColor}; width: 11.5em;
        margin-right: 5px;
        overflow-wrap: break-word;
        margin-bottom: 5px;
        padding: 5px 5px 10px 5px;" ><strong>${msg.username}</strong> <br> ${msg.msg}</p>`;
        div.setAttribute(
          'style',
          ' width: 100%; display: flex;  justify-content: flex-end;'
        );
        chatMessages.appendChild(div);
      } else {
        div.innerHTML = `
        <p class="msg" style = "border-radius: 10px;background-color: #a0a0a0;   width: 11.5em;
        margin-left: 5px;
        overflow-wrap: break-word;
        margin-bottom: 5px; 
        padding: 5px 5px 10px 5px;" > <strong>${msg.username}</strong> <br> ${msg.msg}</p>`;
        div.setAttribute(
          'style',
          ' width: 100%; display: flex;  justify-content: flex-start;'
        );
        chatMessages.appendChild(div);
      }
    }
  }

  /* Mobile Chat Popup */
  MobileOpenChat(): void {
    if ($('.chat').is(':visible')) {
      $('.chat').hide();
      $('.mobile-overlay').hide();
    } else {
      $('.chat').show();
      $('.mobile-overlay').show();
    }
  }

  IsMobile(): boolean {
    return window.innerWidth <= MobileSize;
  }

  @ViewChild('mobileOverlay') mobileOverlay!: ElementRef;

  @HostListener('document:click', ['$event'])
  public onGlobalClick(event: any) {
    if (
      this.IsMobile() &&
      this.mobileOverlay &&
      this.mobileOverlay.nativeElement == event.target
    ) {
      $('.chat').hide();
      $('.mobile-overlay').hide();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (!this.IsMobile()) {
      $('.chat').show();
      $('.mobile-overlay').show();
    } else {
      $('.chat').hide();
      $('.mobile-overlay').hide();
    }
  }
}
