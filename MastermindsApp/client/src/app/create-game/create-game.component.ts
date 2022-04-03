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

    this.roomService.onNicknameEmptyCreate().subscribe(() => {
      $("#error-message-no-nickname-create").css('visibility', 'visible');
      $('#create-game-nickname').css('border', '2px solid #cc0000');
    });
  }

  createRoom() {
    this.resetErrorMessage();

    var nickname = String($("#create-game-nickname").val()).trim();
    this.roomService.onNewRoomRequested(nickname);
  }
  
  resetErrorMessage(){
    $("#error-message-no-nickname-create").css('visibility', 'hidden');
    $('#create-game-nickname').css('border', '0px');
  }
}
