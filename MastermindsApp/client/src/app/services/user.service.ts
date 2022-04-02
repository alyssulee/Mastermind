import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { GameService } from './game-service.service';

@Injectable({
  providedIn: 'root'
})

export class UserService
{
  private socket: Socket;

  constructor(private gameService : GameService) { 
    this.socket = this.gameService.socket;
  }

  onNewRoomRequested () {
    this.socket.emit('room:request-room-creation');
  }
  
  onRoomCodeCreated () {
    return new Observable<string>(observer => {
      this.socket.on('room:room-created', wordSet => {
        observer.next(wordSet);
      });
    });
  }
}