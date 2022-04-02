import { GameWord } from "./GameWord";

export interface Guess {
    gameWord: GameWord;
    username: string;
}