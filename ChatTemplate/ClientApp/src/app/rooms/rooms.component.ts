import { Component, OnInit } from '@angular/core';

import { GameRoom } from '../models/gameroom';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  constructor(private roomService: RoomService) { }

  ngOnInit() {
  }
}
