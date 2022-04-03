import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { GameWord } from '../interfaces/GameWord';
import { GameService } from './game-service.service';
import { Clue, Guess, Role, Team, Turn } from '../interfaces/GameLogicInterfaces';

@Injectable({
  providedIn: 'root'
})

export class GameStateService
{
  socket: Socket;

  // TODO: Initialize these values proplery.
  username: string = "Hello";
  role: Role = Role.Mastermind;
  team: Team = Team.Green;
  turn: Turn = {role: Role.Mastermind, team: Team.Green}
  isMyTurn: boolean = false;

  constructor(private gameService : GameService) { 
    this.socket = this.gameService.socket; 
    this.username = this.socket.id;
    this.isMyTurn = (this.turn.role == this.role && this.turn.team == this.team);
  }

  /* Clue Events */
  sendClueEvent(clue : Clue) {
    this.socket.emit('clue:send-clue', clue);
  }

  /* Guess Events */
  sendSuggestEvent(guess : Guess) {
    this.socket.emit('guess:suggest-word', guess);
  }

  sendUnsuggestEvent(guess : Guess) {
    this.socket.emit('guess:unsuggest-word', guess);
  }

  sendGuessEvent(guess : Guess) {
    this.socket.emit('guess:guess-word', guess);
  }

  endGuessingEvent()
  {
    this.socket.emit('guess:end-guessing');
  }

  onSuggestEvent () {
    return new Observable<Guess>(observer => {
      this.socket.on('guess:suggest-word', guess => {
        observer.next(guess);
      });
    });
  }
  
  onUnsuggestEvent () {
    return new Observable<Guess>(observer => {
      this.socket.on('guess:unsuggest-word', guess => {
        observer.next(guess);
      });
    });
  }

  onGuessEvent () {
    return new Observable<Guess>(observer => {
      this.socket.on('guess:guess-word', guess => {
        observer.next(guess);
      });
    });
  }

  onEndGuessingEvent () {
    return new Observable(observer => {
      this.socket.on('guess:end-guessing', () => {
        console.log('end-guessing')
      });
    });
  }

  /* Word Events */
  sendGenerateWordEvent() {
    this.socket.emit('words:generate-set');
  }

  onGeneratedWordSet () {
    return new Observable<GameWord []>(observer => {
      this.socket.on('words:generated-set', wordSet => {
        observer.next(wordSet);
      });
    });
  }
  
}