import { Injectable, EventEmitter } from '@angular/core';
import { Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { GameService } from './game-service.service';
import { JoinRequest } from '../interfaces/JoinRequest';
import { Role, Team, User } from '../interfaces/GameLogicInterfaces';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private socket: Socket;
  roomcode: string;

  public users: User[] = [];

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

    this.socket.on('all-users', (users: User[]) => {
      this.users = users;
      console.log('got users:', this.users);
    });

    this.socket.on('room:add-user', (user: User) => {
      if (
        !this.users.find((otherUser) => otherUser.username == user.username)
      ) {
        this.users.push(user);
        console.log('add user:', user);
      }
    });

    this.socket.on('room:remove-user', (removeUser: User) => {
      this.users.splice(
        this.users.findIndex((user) => user.username == removeUser.username),
        1
      );
      console.log('remove user:', removeUser);
    });

    this.socket.on('role-updated', (updatedUser: User) => {
      this.users.find((user) => user.username == updatedUser.username)!.role =
        updatedUser.role;
    });

    this.socket.on('team-updated', (updatedUser: User) => {
      this.users.find((user) => user.username == updatedUser.username)!.team =
        updatedUser.team;
    });

    this.socket.on('username-updated', (updatedUsername: any) => {
      let user = this.users.find(
        (user) => user.username == updatedUsername.oldUsername
      );

      if (user) user.username = updatedUsername.username;
    });
  }

  getUsers(team: Team, role: Role) {
    return this.users.filter((user) => user.team == team && user.role == role);
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
        this.socket.emit('load-users', roomCode);
        this.socket.emit('load-game-log', roomCode);
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
