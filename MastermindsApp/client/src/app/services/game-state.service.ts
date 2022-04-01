import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { GameWord } from '../interfaces/GameWord';
import { GameService } from './game-service.service';

@Injectable({
  providedIn: 'root'
})

export class GameStateService
{
  private socket: Socket;

  constructor(private gameService : GameService) { 
    this.socket = this.gameService.socket; 
    this.sendGenerateWordEvent();
  }

  sendGenerateWordEvent() {
    // let socketRoom = io.sockets.manager.roomClients[this.socket.id]
    this.socket.emit('words:generate-set', "ABC");
  }

  onGeneratedWordSet () {
    return new Observable<GameWord []>(observer => {
      this.socket.on('words:generated-set', wordSet => {
        observer.next(wordSet);
      });
    });
  }
  
}