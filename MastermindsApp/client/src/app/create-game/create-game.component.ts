import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../services/room.service';
import { GameStateService } from '../services/game-state.service';
import * as $ from 'jquery';
import { Clue, Role, Team, Message } from '../interfaces/GameLogicInterfaces';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss'],
})
export class CreateGameComponent implements OnInit {
  username: string;
  constructor(
    private router: Router,
    private roomService: RoomService,
    private gameStateService: GameStateService
  ) {
    this.username = '';
  }

  ngOnInit(): void {
    this.roomService.onJoinedCreatedRoom().subscribe((roomCode: string) => {
      this.update();
      this.router.navigate(['/game/' + roomCode]);
    });

    this.roomService.onNicknameEmptyCreate().subscribe(() => {
      $('#error-message-no-nickname-create').css('visibility', 'visible');
      $('#create-game-nickname').css('border', '2px solid #cc0000');
    });

    this.roomService.onNicknameTooLongCreate().subscribe(() => {
      $('#error-message-long-nickname-create').css('visibility', 'visible');
      $('#create-game-nickname').css('border', '2px solid #cc0000');
    });
  }

  update() {
    this.gameStateService.createdUsername(this.username);
    this.gameStateService.setTeamAndRole(Team.None, Role.None);
  }

  createRoom() {
    this.resetErrorMessage();

    this.username = String($('#create-game-nickname').val()).trim();
    this.roomService.onNewRoomRequested(this.username);
  }

  resetErrorMessage() {
    $('#error-message-no-nickname-create').css('visibility', 'hidden');
    $('#error-message-long-nickname-create').css('visibility', 'hidden');
    $('#create-game-nickname').css('border', '0px');
  }
}
