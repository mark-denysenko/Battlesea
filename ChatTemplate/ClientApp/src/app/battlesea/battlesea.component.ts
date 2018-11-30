import { Component, OnInit, Inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { HttpClient } from '@angular/common/http';

import { GameRoom } from '../models/gameroom';
import { RoomService } from '../services/room.service';
import { PlayerStatus } from '../models/player-status.enum';
import { Player } from '../models/player';
import { GameService } from '../services/game.service';
import { Battlefield } from '../models/battlefield';

@Component({
  selector: 'app-battlesea',
  templateUrl: './battlesea.component.html',
  styleUrls: ['./battlesea.component.css']
})
export class BattleseaComponent implements OnInit {
  PlayerStatus : typeof PlayerStatus = PlayerStatus;

  public player: Player;

  constructor(private gameService: GameService) {
    gameService.player.subscribe(player => this.player = player);
  }

  ngOnInit() {
  }

  saveNickname() {
    this.gameService.setNickname(this.player.nickname);
  }

  readyToBattle(battlefield: Battlefield): void {
    this.gameService.setBattlefield(battlefield);
  }
}
