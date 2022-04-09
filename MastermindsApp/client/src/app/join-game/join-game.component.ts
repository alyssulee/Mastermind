import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../services/room.service';
import { GameStateService } from '../services/game-state.service';
import { Clue, Role, Team, Message } from '../interfaces/GameLogicInterfaces';

import * as $ from 'jquery';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss'],
})
export class JoinGameComponent implements OnInit {
  username: string;
  constructor(
    private router: Router,
    private roomService: RoomService,
    private gameStateService: GameStateService
  ) {
    this.username = '';
  }

  ngOnInit(): void {
    this.roomService.onJoinedRoom().subscribe((roomCode: string) => {
      this.router.navigate(['/game/' + roomCode]);
      this.gameStateService.setUsername(this.username);
      this.gameStateService.setTeamAndRole(Team.None, Role.None);
    });

    this.roomService.onNicknameUsed().subscribe(() => {
      $('#error-message-nickname').css('visibility', 'visible');
      $('#error-message-nickname').show();
      $('#error-message-no-nickname-join').hide();
      $('#join-game-nickname').css('border', '2px solid #cc0000');
    });

    this.roomService.onNicknameEmptyJoin().subscribe(() => {
      $('#error-message-no-nickname-join').css('visibility', 'visible');
      $('#error-message-no-nickname-join').show();
      $('#error-message-nickname').hide();
      $('#join-game-nickname').css('border', '2px solid #cc0000');
    });

    this.roomService.onRoomDoesNotExist().subscribe(() => {
      $('#error-message-room-code').css('visibility', 'visible');
      $('#error-message-room-code').show();
      $('#error-message-max-capacity').hide();
      $('#room-code').css('border', '2px solid #cc0000');
    });

    this.roomService.onMaxCapacityReached().subscribe(() => {
      $('#error-message-max-capacity').css('visibility', 'visible');
      $('#error-message-max-capacity').show();
      $('#error-message-room-code').hide();
      $('#room-code').css('border', '2px solid #cc0000');
    });
  }

  joinRoom() {
    this.resetErrorMessages();

    this.username = String($('#join-game-nickname').val()).trim();
    var roomCode = String($('#room-code').val());
    this.roomService.onRequestToJoinRoom(this.username, roomCode);
  }

  resetErrorMessages() {
    $('#error-message-nickname').css('visibility', 'hidden');
    $('#error-message-no-nickname-join').css('visibility', 'hidden');
    $('#error-message-nickname').show();
    $('#error-message-no-nickname-join').hide();
    $('#error-message-room-code').css('visibility', 'hidden');
    $('#error-message-max-capacity').css('visibility', 'hidden');
    $('#error-message-room-code').show();
    $('#error-message-max-capacity').hide();
    $('#join-game-nickname').css('border', '0px');
    $('#room-code').css('border', '0px');
  }
}
