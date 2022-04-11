import { getLocaleDateFormat } from '@angular/common';
import { GameWord, WordCategory } from './GameWord';

const MobileSize = 800;
export default MobileSize;

export class HelperMethods {
  public static getColorByTeam(team: Team): string {
    if (team == Team.Purple) return '#b264f2';
    else if (team == Team.Green) return '#4cc36d';
    else return '#5f5f5f';
  }

  public static getColorByCategory(category: WordCategory): string {
    switch (category) {
      case WordCategory.Purple:
        return '#b264f2';
      case WordCategory.Green:
        return '#4cc36d';
      case WordCategory.Bomb:
        return '#ff9900';
      case WordCategory.Neutral:
        return '#5f5f5f';
    }
  }
}

export enum Role {
  Mastermind = 'Mastermind',
  Minion = 'Minion',
  None = 'None',
}

export enum Team {
  Purple = 'Purple',
  Green = 'Green',
  None = 'None',
}

export interface Turn {
  team: Team;
  role: Role;
}

export interface Clue {
  word: string;
  number: number;
  user?: User;
}

export interface Guess {
  gameWord: GameWord;
  user: User;
}

export interface User {
  username: string;
  team: Team;
  role: Role;
}

export interface Message {
  username: string;
  msg: string;
  team: Team;
}
