import { Component, OnInit } from '@angular/core';

import { GameRoom } from '../models/gameroom';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  public rooms: GameRoom[] = [];

  constructor(private roomService: RoomService) {
  	this.roomService.updateRoomsEvent.subscribe(rooms => this.rooms = rooms);
  }

  ngOnInit() {
  }

  public createRoom(): void {
  	this.roomService.createRoom();
  }

  public joinToRoom(room: GameRoom): void {
  	this.roomService.joinRoom(room.roomId);
  }

  public exitFromRoom(room: GameRoom): void {
  	this.roomService.exitRoom(room.roomId);
  }

  // only for own-created
  public deleteRoom(room: GameRoom): void {
  	this.roomService.deleteRoom(room.roomId);
  }
}
