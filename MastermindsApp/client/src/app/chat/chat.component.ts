import { Component, OnInit } from '@angular/core';
import { Clue, Role, Team, Message } from '../interfaces/GameLogicInterfaces';
import { GameStateService } from '../services/game-state.service';
import { ChatService } from '../services/chat.service';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

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

  constructor(
    private chatService: ChatService,
    private gameState: GameStateService,
    private elementRef: ElementRef
  ) {
    this.isMastermind = gameState.user.role == Role.Mastermind;
    this.username = gameState.user.username;
    this.team = gameState.user.team;
  }

  ngOnInit(): void {
    this.chatService.updated().subscribe((msg: Message) => {
      this.outputMessage(msg);
      var chatMessages =
        this.elementRef.nativeElement.querySelector('.chat-msg');
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }

  sendMessage() {
    let msg: Message = {
      username: this.gameState.user.username,
      msg: this.message,
      team: this.gameState.user.team,
    };
    this.chatService.sendMessage(msg);
    this.message = '';
  }

  outputMessage(msg: Message) {
    var chatMessages = this.elementRef.nativeElement.querySelector('.chat-msg');
    //Create a new div element
    const div = document.createElement('div');
    //Add the class message to the div
    div.classList.add('msg-container');
    div.classList.add('right');
    if (msg.team == this.gameState.user.team) {
      if (msg.username == this.gameState.user.username) {
        div.innerHTML = `
        <p class="msg" style = "max-width: 50%;border-radius: 10px;background-color: green;" >${msg.msg}</p>`;
        div.setAttribute(
          'style',
          ' width: 100%; display: flex;  justify-content: flex-end;'
        );
        chatMessages.appendChild(div);
      } else {
        div.innerHTML = `
        <p class="msg" style = "max-width: 50%;border-radius: 10px;background-color: grey;" >${msg.msg}</p>`;
        div.setAttribute(
          'style',
          ' width: 100%; display: flex;  justify-content: flex-start;'
        );
        chatMessages.appendChild(div);
      }
    }
  }
}
