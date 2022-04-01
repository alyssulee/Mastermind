import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { GameWord } from '../interfaces/GameWord';

@Injectable({
  providedIn: 'root'
})
export class GameStateService
{
  private socket: Socket;

  constructor() { 
    // TODO: access GameService socket instead of creating a new one...
    this.socket = io('http://localhost:8080');  
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