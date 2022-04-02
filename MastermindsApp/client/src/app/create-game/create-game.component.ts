import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../services/room.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {
  constructor(private router: Router, private roomService: RoomService) { 
   }

  ngOnInit(): void {
    this.roomService.onJoinedRoom().subscribe((roomCode: string) => {
      this.router.navigate(['/game/' + roomCode]);
    });
  }

  createRoom() {
    var nickname = String($("#create-game-nickname").val());
    this.roomService.onNewRoomRequested(nickname);
  }
}
