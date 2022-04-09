import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { GameWord } from '../interfaces/GameWord';
import { GameService } from './game-service.service';
import {
  Clue,
  Guess,
  Role,
  Team,
  Turn,
  User,
} from '../interfaces/GameLogicInterfaces';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  socket: Socket;

  // TODO: Initialize these values proplery.
  user: User = {
    username: 'Hello',
    team: Team.None,
    role: Role.None,
  };

  turn: Turn = { role: Role.Mastermind, team: Team.None };
  isMyTurn: boolean =
    this.turn.role == this.user.role && this.turn.team == this.user.team;
  endOfGame: boolean = false;
  winningTeam: Team = Team.None;
  gameWordSet: { [word: string]: GameWord } = {};
  isClicked: boolean = false;

  constructor(private gameService: GameService) {
    this.socket = this.gameService.socket;
    this.user.username = this.socket.id;
    this.isMyTurn =
      this.turn.role == this.user.role && this.turn.team == this.user.team;
  }

  clicked() {
    this.isClicked = !this.isClicked;
    this.socket.emit('clicked-userpopup');
    this.updated();
  }

  isButtonClicked() {
    return this.isClicked;
  }

  setTeamAndRole(team: Team, role: Role) {
    if (this.user.role != role) this.socket.emit('changed-role', role);

    if (this.user.team != team) this.socket.emit('changed-team', team);
    this.socket.emit('message:send-messages');
  }

  setTeam(team: Team) {
    this.socket.emit('changed-team', team);
    this.socket.emit('message:send-messages');
  }

  createdUsername(username: string) {
    this.socket.emit('created-username', username);
  }

  setUsername(username: string) {
    if (this.user.username != username)
      this.socket.emit('changed-username', username);
  }

  updated() {
    return new Observable<GameStateService>((observer) => {
      this.socket.on('team-updated', (team) => {
        this.user.team = team;
        this.isMyTurn =
          this.turn.role == this.user.role && this.turn.team == this.user.team;
        observer.next();
      });

      this.socket.on('role-updated', (role) => {
        this.user.role = role;
        this.isMyTurn =
          this.turn.role == this.user.role && this.turn.team == this.user.team;
        observer.next();
      });

      this.socket.on('username-updated', (username) => {
        this.user.username = username;
        observer.next();
      });

      this.socket.on('username-created', (username) => {
        this.user.username = username;
        observer.next();
      });

      this.socket.on('clicked-user-popup', () => {
        observer.next();
      });

      this.socket.on('turn:updated', (turn) => {
        this.turn = turn;
        this.isMyTurn =
          this.turn.role == this.user.role && this.turn.team == this.user.team;
        observer.next();
      });

      this.socket.on('game:end', (winner) => {
        this.endOfGame = true;
        this.winningTeam = winner;
        this.isMyTurn = false;
        this.turn = { role: Role.None, team: Team.None };
        observer.next();
      });

      this.socket.on('team:starting-team', (team) => {
        this.turn = { role: Role.Mastermind, team: team };
        this.isMyTurn =
          this.turn.role == this.user.role && this.turn.team == this.user.team;
        observer.next();
      });

      this.socket.on('game:restart-game', () => {
        this.winningTeam = Team.None;
        this.endOfGame = false;
        observer.next();
      });

      this.socket.on('game:update-words', (wordSet) => {
        this.gameWordSet = wordSet;
        observer.next();
      });
    });
  }

  updateGuessedWord(word: GameWord) {
    this.gameWordSet[word.word].guessed = true;
    this.updated();
  }

  updateSuggestedWord(word: GameWord, user: User) {
    this.gameWordSet[word.word].suggested.push(user);
    this.updated();
  }

  updateUnsuggestedWord(word: GameWord, user: User) {
    this.gameWordSet[word.word].suggested = this.gameWordSet[
      word.word
    ].suggested.filter((suggest) => suggest !== user);
    this.updated();
  }

  setWords(words: { [word: string]: GameWord }) {
    this.gameWordSet = words;
  }

  /* Restart Game Event*/
  sendRestartGameEvent() {
    this.socket.emit('game:restart-game');
  }

  /* Clue Events */
  sendClueEvent(clue: Clue) {
    this.socket.emit('clue:send-clue', clue);
  }

  onSendClueEvent() {
    return new Observable<Clue>((observer) => {
      this.socket.on('clue:send-clue', (clue) => {
        observer.next(clue);
      });
    });
  }

  /* Guess Events */
  sendSuggestEvent(guess: Guess) {
    console.log('Suggest', guess);
    this.socket.emit('guess:suggest-word', guess);
  }

  sendUnsuggestEvent(guess: Guess) {
    console.log('Unsuggest', guess);
    this.socket.emit('guess:unsuggest-word', guess);
  }

  sendGuessEvent(guess: Guess) {
    console.log('Guessing word', JSON.stringify(guess));
    this.socket.emit('guess:guess-word', guess);
  }

  endGuessingEvent() {
    this.socket.emit('guess:end-guessing');
  }

  onSuggestEvent() {
    return new Observable<Guess>((observer) => {
      this.socket.on('guess:suggest-word', (guess) => {
        observer.next(guess);
      });
    });
  }

  onUnsuggestEvent() {
    return new Observable<Guess>((observer) => {
      this.socket.on('guess:unsuggest-word', (guess) => {
        observer.next(guess);
      });
    });
  }

  onGuessEvent() {
    return new Observable<Guess>((observer) => {
      this.socket.on('guess:guess-word', (guess) => {
        observer.next(guess);
      });
    });
  }

  onEndGuessingEvent() {
    return new Observable((observer) => {
      this.socket.on('guess:end-guessing', () => {
        console.log('end-guessing');
      });
    });
  }

  // /* Word Events */
  // sendGenerateWordEvent() {
  //   this.socket.emit('words:generate-set');
  // }

  onGeneratedWordSet() {
    return new Observable<GameWord[]>((observer) => {
      this.socket.on('words:generated-set', (wordSet) => {
        this.setWords(wordSet);
        observer.next(wordSet);
      });
    });
  }
}
