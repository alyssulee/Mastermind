import { GameWord } from "./GameWord";

export enum Role {
  Mastermind = 'Mastermind',
  Minion = 'Minion',
  None = 'None'
}

export enum Team {
  Purple = 'Purple',
  Green = 'Green',
  Minion = 'Minion'
}

export interface Turn {
  team: Team;
  role: Role;
}

export interface Clue {
  word: string;
  number: number;
}

export interface Guess {
    gameWord: GameWord;
    username: string;
}