import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { GameService } from './game-service.service';
import { JoinRequest } from '../interfaces/JoinRequest';
import { Clue, Role, Team, Message } from '../interfaces/GameLogicInterfaces';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;

  message: string = '';
  constructor(private gameService: GameService) {
    this.socket = this.gameService.socket;
  }

  sendMessage(msg: Message) {
    console.log('Sending Message ', JSON.stringify(msg));
    this.socket.emit('message:new-message', msg);
  }

  updated() {
    return new Observable<Message>((observer) => {
      this.socket.on('message:send-message', (msg) => {
        console.log('Received: ' + JSON.stringify(msg));
        observer.next(msg);
      });
    });
  }

  clientMessagesReceived() {
    return new Observable<Message[]>((observer) => {
      this.socket.on('message:client-messages', (clientMessages) => {
        observer.next(clientMessages);
      });
    });
  }
}
