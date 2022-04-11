import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Socket } from 'socket.io-client';
import { Clue, Guess, User } from '../interfaces/GameLogicInterfaces';
import { GameService } from './game-service.service';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root',
})
export class GameLogService {
  private socket: Socket;
  private logSubject = new ReplaySubject<LogInfo>();

  constructor(
    private gameService: GameService,
    private roomService: RoomService
  ) {
    this.socket = this.gameService.socket;

    this.socket.on('full-game-log', (log: LogInfo[]) => {
      for (let info of log) this.logSubject.next(info);
    });
  }

  public getLogSubject() {
    return this.logSubject;
  }

  public log(logInfo: LogInfo) {
    this.logSubject.next(logInfo);

    // Automatically include roomcode for server
    logInfo.roomCode = this.roomService.roomcode;
    this.socket.emit('add-game-log', logInfo);
  }
}

export enum LogType {
  Clue,
  Guess,
  EndGuessing,
}

export interface LogInfo {
  logType: LogType;
  user?: User;
  clue?: Clue;
  guess?: Guess;
  roomCode?: string;
}
