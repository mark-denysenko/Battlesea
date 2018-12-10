import { Injectable, Inject } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GameRoom } from '../models/gameroom';
import { SignalRService } from '../services/signal-r.service';
import { ServerFunctions } from './server-functions';

@Injectable()
export class RoomService {
  public rooms: GameRoom[] = [];
  public requestUrl: string;
  public joinedRoom: GameRoom;

  public updateRoomsEvent: Subject<GameRoom[]> = new BehaviorSubject<GameRoom[]>(new Array<GameRoom>());

  constructor(private signalrService: SignalRService, private http: HttpClient, @Inject('BASE_URL') _baseUrl: string) {
  	this.requestUrl = _baseUrl + ServerFunctions.API_ENDPOINT;

    this.updateRoomsEvent.subscribe(rooms => this.rooms = rooms);
  	this.signalrService.addListener(ServerFunctions.ROOMS_UPDATE_EVENT, (rooms: GameRoom[]) => this.updateRoomsEvent.next(rooms));
  	this.updateRooms();
  }

  public createRoom(): void {
  	this.signalrService.invoke(ServerFunctions.CREATE_ROOM, null);
  }

  public joinRoom(roomId): void {
  	this.signalrService.invoke(ServerFunctions.JOIN_ROOM, roomId);
  	this.http.get<GameRoom>(this.requestUrl + '/' + roomId).subscribe(result => this.joinedRoom = result);
  }

  public exitRoom(roomId): void {
  	this.signalrService.invoke(ServerFunctions.EXIT_ROOM, roomId);
  	this.joinedRoom = undefined;
  }

  public deleteRoom(roomId): void {
    this.signalrService.invoke(ServerFunctions.DELETE_ROOM, roomId);
  }

  public updateRooms(): void {
  	this.http.get<GameRoom[]>(this.requestUrl + 'GetAllRooms')
             .subscribe(result => this.updateRoomsEvent.next(result));
  }
}
