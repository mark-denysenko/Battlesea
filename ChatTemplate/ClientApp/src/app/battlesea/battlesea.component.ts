import { Component, OnInit, Inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { HttpClient } from '@angular/common/http';

import { GameRoom } from '../models/gameroom';
import { RoomService } from '../services/room.service';
import { PlayerStatus } from '../models/player-status.enum';
import { SignalRService } from '../services/signal-r.service';
import { Player } from '../models/player';

@Component({
  selector: 'app-battlesea',
  templateUrl: './battlesea.component.html',
  styleUrls: ['./battlesea.component.css']
})
export class BattleseaComponent implements OnInit {
  PlayerStatus : typeof PlayerStatus = PlayerStatus;

  public player: Player = new Player();
  public status = PlayerStatus.none;

  constructor(private _signalr: SignalRService) {
    _signalr.addListener('joinedToRoom', () => this.status = PlayerStatus.joined);
    _signalr.addListener('preparing', () => this.status = PlayerStatus.preparing);

    _signalr.addListener('readyToBattle', () => this.status = PlayerStatus.ready);

    this.player.status = PlayerStatus.none;
    console.log('Status player', this.status);
  }

  ngOnInit() {
  }

  saveNickname() {
    this._signalr.invoke('savePlayerNickname', this.player.nickname);
    this._signalr.getConnectionId().then(id => this.player.id = id);
  }

  // ready(): void {
  //   // invoke ('readyToBattle')
  //   this.status = PlayerStatus.ready;
  // }
}
