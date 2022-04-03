export enum WordCategory {
    Green = "Green",
    Purple = "Purple",
    Neutral = "Neutral",
    Bomb = "Bomb",
}

export interface GameWord {
  word: string;
  category: WordCategory;
  guessed: boolean;
}