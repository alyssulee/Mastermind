import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {

  constructor(private router: Router) {  }

  ngOnInit(): void {
  }

  createRoom() {
    console.log("Room Created");
    var roomCode = "1";
    this.router.navigate(['/game/' + roomCode]);
  }
}
