import { Injectable } from '@angular/core';
import { Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { GameService } from './game-service.service';
import { joinRequest } from '../interfaces/JoinRequest';

@Injectable({
  providedIn: 'root'
})

export class RoomService
{
  private socket: Socket;
  roomcode: string;

  constructor(private gameService : GameService) { 
    this.socket = this.gameService.socket;
    this.roomcode = "";
  }

  onNewRoomRequested (nickname: string) {
    this.socket.emit('room:request-room-creation', nickname);
  }

  onRequestToJoinRoom (nickname: string, roomCode: string) {
    let joinRequest:joinRequest = {
      nickname: nickname,
      roomCode: roomCode
    }

    this.socket.emit('room:request-to-join', JSON.stringify(joinRequest));
  }
  
  onJoinedRoom () {
    return new Observable<string>(observer => {
      this.socket.on('room:joined-room', roomCode => {
        this.roomcode = roomCode;
        observer.next(roomCode);
      });
    });
  }

  onNicknameEmptyCreate(){
    return new Observable<string>(observer => {
      this.socket.on('room:nickname-empty-create', () => {
        observer.next();
      });
    });
  }

  onNicknameEmptyJoin(){
    return new Observable<string>(observer => {
      this.socket.on('room:nickname-empty-join', () => {
        observer.next();
      });
    });
  }

  onNicknameUsed(){
    return new Observable<string>(observer => {
      this.socket.on('room:user-already-exists', () => {
        observer.next();
      });
    });
  }

  onRoomDoesNotExist(){
    return new Observable<string>(observer => {
      this.socket.on('room:room-does-not-exist', () => {
        observer.next();
      });
    });
  }
}