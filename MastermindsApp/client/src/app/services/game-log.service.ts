import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Clue, Guess, User } from '../interfaces/GameLogicInterfaces';

@Injectable({
  providedIn: 'root',
})
export class GameLogService {
  private logSubject = new ReplaySubject<LogInfo>();

  constructor() {}

  public getLogSubject() {
    return this.logSubject;
  }

  public log(logInfo: LogInfo) {
    this.logSubject.next(logInfo);
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
}
