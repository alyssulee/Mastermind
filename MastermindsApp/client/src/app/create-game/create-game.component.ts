import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'socket.io-client';
import { GameService } from '../services/game-service.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) { 
   }

  ngOnInit(): void {
    this.userService.onRoomCodeCreated().subscribe((roomCode: string) => {
      console.log('got a msg: ' + roomCode);
      this.router.navigate(['/game/' + roomCode]);
    });
  }

  createRoom() {
    console.log("Room Created");
    this.userService.onNewRoomRequested();
  }
}
