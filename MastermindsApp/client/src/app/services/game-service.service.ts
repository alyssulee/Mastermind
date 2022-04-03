import { Injectable } from '@angular/core';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public socket = io('http://localhost:8080');

  constructor() { 
    console.log('GameService created');
  }
}
