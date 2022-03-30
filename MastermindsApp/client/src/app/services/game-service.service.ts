import { Injectable } from '@angular/core';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  socket = io('http://localhost:8080');

}
