import { Injectable, EventEmitter } from '@angular/core';
import { Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { GameService } from './game-service.service';
import { JoinRequest } from '../interfaces/JoinRequest';
import { Team } from '../interfaces/GameLogicInterfaces';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private socket: Socket;
  roomcode: string;

  mastermindTaken: { green: boolean; purple: boolean } = {
    green: false,
    purple: false,
  };

  constructor(private gameService: GameService) {
    this.socket = this.gameService.socket;
    this.roomcode = '';

    this.socket.on('mastermind-set', (team: Team) => {
      if (team == Team.Green) this.mastermindTaken.green = true;
      if (team == Team.Purple) this.mastermindTaken.purple = true;
    });

    this.socket.on('mastermind-unset', (team: Team) => {
      if (team == Team.Green) this.mastermindTaken.green = false;
      if (team == Team.Purple) this.mastermindTaken.purple = false;
    });

    this.socket.on('mastermind-taken', (data) => {
      this.mastermindTaken = data;
    });
  }

  onNewRoomRequested(nickname: string) {
    this.socket.emit('room:request-room-creation', nickname);
  }

  onRequestToJoinRoom(nickname: string, roomCode: string) {
    let joinRequest: JoinRequest = {
      nickname: nickname,
      roomCode: roomCode,
    };

    this.socket.emit('room:request-to-join', JSON.stringify(joinRequest));
  }

  onJoinedRoom() {
    return new Observable<string>((observer) => {
      this.socket.on('room:joined-room', (roomCode) => {
        this.roomcode = roomCode;
        console.log('emitting room:check');
        this.socket.emit('room:check-mastermind-taken');
        this.socket.emit('message:send-messages');
        observer.next(roomCode);
      });
    });
  }

  onJoinedCreatedRoom() {
    return new Observable<string>((observer) => {
      this.socket.on('room:joined-created-room', (roomCode) => {
        this.roomcode = roomCode;
        this.socket.emit('room:check-mastermind-taken');
        this.socket.emit('message:send-messages');
        observer.next(roomCode);
      });
    });
  }

  onNicknameEmptyCreate() {
    return new Observable<string>((observer) => {
      this.socket.on('room:nickname-empty-create', () => {
        observer.next();
      });
    });
  }

  onNicknameEmptyJoin() {
    return new Observable<string>((observer) => {
      this.socket.on('room:nickname-empty-join', () => {
        observer.next();
      });
    });
  }

  onNicknameUsed() {
    return new Observable<string>((observer) => {
      this.socket.on('room:user-already-exists', () => {
        observer.next();
      });
    });
  }

  onRoomDoesNotExist() {
    return new Observable<string>((observer) => {
      this.socket.on('room:room-does-not-exist', () => {
        observer.next();
      });
    });
  }

  onMaxCapacityReached() {
    return new Observable<string>((observer) => {
      this.socket.on('room:max-capacity', () => {
        observer.next();
      });
    });
  }

  onRequestToLeave() {
    this.socket.emit('room:leave');
  }

  onLeaveRoom() {
    return new Observable<string>((observer) => {
      this.socket.on('room: leave-room', () => {
        observer.next();
      });
    });
  }
}
