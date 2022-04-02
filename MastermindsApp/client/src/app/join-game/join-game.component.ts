import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../services/room.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss']
})
export class JoinGameComponent implements OnInit {

  constructor(private router: Router, private roomService: RoomService) { }

  ngOnInit(): void {
    this.roomService.onJoinedRoom().subscribe((roomCode: string) => {
      this.router.navigate(['/game/' + roomCode]);
    });

    this.roomService.onNicknameUsed().subscribe(() => {
      $("#error-message-nickname").css('visibility', 'visible');
      $('#join-game-nickname').css('border', '2px solid #cc0000');
    });
    
    this.roomService.onNicknameEmptyJoin().subscribe(() => {
      $("#error-message-no-nickname-join").css('visibility', 'visible');
      $('#join-game-nickname').css('border', '2px solid #cc0000');
    });

    this.roomService.onRoomDoesNotExist().subscribe(() => {
      $("#error-message-room-code").css('visibility', 'visible');
      $('#room-code').css('border', '2px solid #cc0000');
    });
  }

  joinRoom() {
    this.resetErrorMessages();

    var nickname = String($("#join-game-nickname").val());
    var roomCode = String($("#room-code").val());
    this.roomService.onRequestToJoinRoom(nickname, roomCode);
  }

  resetErrorMessages(){
    $("#error-message-nickname").css('visibility', 'hidden');
    $("#error-message-no-nickname-join").css('visibility', 'hidden');
    $("#error-message-room-code").css('visibility', 'hidden');
    $('#join-game-nickname').css('border', '0px');
    $('#room-code').css('border', '0px');
  }
}