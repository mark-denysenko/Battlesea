import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameRoom } from '../models/gameroom';
import { SignalRService } from '../services/signal-r.service';

@Injectable()
export class RoomService {
  rooms: GameRoom[];
  requestUrl: string;
  joinedRoom: GameRoom;

  constructor(private signalrService: SignalRService, private http: HttpClient, @Inject('BASE_URL') _baseUrl: string) {
  	this.requestUrl = _baseUrl + 'api/Game/';

  	this.signalrService.addListener("roomsUpdate", (rooms: GameRoom[]) => this.rooms = rooms);
  	this.updateRooms();
  }

  public createRoom(): void {
  	this.signalrService.invoke('createRoom', null);
  }

  public deleteRoom(roomId): void {
  	this.signalrService.invoke('deleteRoom', roomId);
  }

  public joinRoom(roomId): void {
  	this.signalrService.invoke('joinRoom', roomId);
  	this.http.get<GameRoom>(this.requestUrl + '/' + roomId).subscribe(result => this.joinedRoom = result);
  }

  public exitRoom(roomId): void {
  	this.signalrService.invoke('exitRoom', roomId);
  	this.joinedRoom = undefined;
  }

  public updateRooms(): void {
  	this.http.get<GameRoom[]>(this.requestUrl + 'GetAllRooms').subscribe(result => {
      this.rooms = result;
      }, error => console.error(error));
  }
}
