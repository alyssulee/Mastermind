import { Injectable, EventEmitter } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, ReplaySubject, Subject } from 'rxjs';
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
import { BehaviorSubject } from 'rxjs';
import { GameLogService, LogType } from './game-log.service';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  socket: Socket;

  user: User = {
    username: '',
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

  private stateUpdated = new BehaviorSubject<boolean>(true);
  private clueObservable = new ReplaySubject<Clue>();
  private endGuessingSubject = new ReplaySubject<User>();
  private suggestWordSubject = new Subject<Guess>();
  private unsuggestWordSubject = new Subject<Guess>();
  private guessWordSubject = new ReplaySubject<Guess>();
  private generatedWordSetSubject = new BehaviorSubject<GameWord[] | undefined>(
    undefined
  );

  constructor(
    private gameService: GameService,
    private logService: GameLogService
  ) {
    this.socket = this.gameService.socket;
    this.user.username = this.socket.id;
    this.isMyTurn =
      this.turn.role == this.user.role && this.turn.team == this.user.team;

    this.socket.on('username-created', (username) => {
      console.log('username created', username);
      this.user.username = username;
      this.stateUpdated.next(true);
    });

    this.socket.on('team-updated', (updatedUser: User) => {
      if (updatedUser.username == this.user.username) {
        this.user.team = updatedUser.team;
        this.isMyTurn =
          this.turn.role == this.user.role && this.turn.team == this.user.team;
        this.stateUpdated.next(true);
      }
    });

    this.socket.on('role-updated', (updatedUser: User) => {
      if (updatedUser.username == this.user.username) {
        this.user.role = updatedUser.role;
        this.isMyTurn =
          this.turn.role == this.user.role && this.turn.team == this.user.team;
        this.stateUpdated.next(true);
      }
    });

    this.socket.on('username-updated', (updatedUsername: any) => {
      if (updatedUsername.oldUsername == this.user.username) {
        this.user.username = updatedUsername.username;
        this.stateUpdated.next(true);
      }
    });

    this.socket.on('clicked-user-popup', () => {
      this.stateUpdated.next(true);
    });

    this.socket.on('turn:updated', (turn) => {
      this.turn = turn;
      this.isMyTurn =
        this.turn.role == this.user.role && this.turn.team == this.user.team;
      this.stateUpdated.next(true);
    });

    this.socket.on('game:end', (winner) => {
      this.endOfGame = true;
      this.winningTeam = winner;
      this.isMyTurn = false;
      this.turn = { role: Role.None, team: Team.None };
      this.stateUpdated.next(true);
    });

    this.socket.on('team:starting-team', (team) => {
      this.turn = { role: Role.Mastermind, team: team };
      this.isMyTurn =
        this.turn.role == this.user.role && this.turn.team == this.user.team;
      this.stateUpdated.next(true);
    });

    this.socket.on('game:restart-game', () => {
      this.winningTeam = Team.None;
      this.endOfGame = false;
      this.stateUpdated.next(true);
    });

    this.socket.on('game:update-words', (wordSet) => {
      this.gameWordSet = wordSet;
      this.stateUpdated.next(true);
    });

    this.socket.on('server:clue-registered', (clue) => {
      this.clueObservable.next(clue);

      this.logService.log({
        logType: LogType.Clue,
        clue: clue,
        user: clue.user,
      });
    });

    this.socket.on('server:end-guessing', (user) => {
      console.log('end-guessing');
      this.endGuessingSubject.next(user);
      this.logService.log({ logType: LogType.EndGuessing, user });
    });

    this.socket.on('guess:suggest-word', (guess) => {
      this.suggestWordSubject.next(guess);
    });

    this.socket.on('guess:unsuggest-word', (guess) => {
      this.unsuggestWordSubject.next(guess);
    });

    this.socket.on('server:word-guess-registered', (guess) => {
      this.guessWordSubject.next(guess);
      this.logService.log({ logType: LogType.Guess, guess });
    });

    this.socket.on('words:generated-set', (wordSet) => {
      this.setWords(wordSet);
      this.generatedWordSetSubject.next(wordSet);
    });
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

    this.user.role = role;
    this.user.team = team;
    this.socket.emit('message:send-messages');
  }

  setTeam(team: Team) {
    this.user.team = team;

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
    return this.stateUpdated;
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
    return this.clueObservable;
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
    this.socket.emit('guess:end-guessing', this.user);
  }

  onSuggestEvent() {
    return this.suggestWordSubject;
  }

  onUnsuggestEvent() {
    return this.unsuggestWordSubject;
  }

  onGuessEvent() {
    return this.guessWordSubject;
  }

  onGeneratedWordSet() {
    return this.generatedWordSetSubject;
  }

  onEndGuessingEvent() {
    return this.endGuessingSubject;
  }

  // /* Word Events */
  // sendGenerateWordEvent() {
  //   this.socket.emit('words:generate-set');
  // }
}
