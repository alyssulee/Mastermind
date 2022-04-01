import { Injectable } from '@angular/core';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  public static socket = io('http://localhost:8080');

}
