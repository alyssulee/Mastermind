import { Component, OnInit } from '@angular/core';
import { RoomService } from '../services/room.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-roomcode',
  templateUrl: './roomcode.component.html',
  styleUrls: ['./roomcode.component.scss']
})
export class RoomcodeComponent implements OnInit {

  roomcode: string;
  constructor(private roomService : RoomService) { 
    this.roomcode = roomService.roomcode;
  }

  ngOnInit(): void {
  }

  copyMessage(){
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(this.roomcode).select();
    document.execCommand("copy");
    $temp.remove();

    $('#copied-tooltip').show().fadeOut(2000);
  }
}