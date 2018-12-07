import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { SignalRService } from './signal-r.service';
import { Player } from '../models/player';
import { PlayerStatus } from '../models/player-status.enum';
import { Battlefield } from '../models/battlefield';
import { GameRoom } from '../models/gameroom';
import { PlayerEvents } from './player-events';
import { ServerFunctions } from './server-functions';

import { GameConfiguration } from '../models/game-configuration';

@Injectable()
export class GameService {

  public player: Subject<Player> = new BehaviorSubject<Player>(new Player());
  
  private _player: Player;

  constructor(private _signalr: SignalRService) {
  	this.player.subscribe(player => this._player = player);
    _signalr.addListener(PlayerEvents.UPDATE_PLAYER, (player) => player ? this.player.next(player) : null);
  	_signalr.addListener(PlayerEvents.PLAYER_JOINED, () => { this._player.status = PlayerStatus.joined; this.setPlayer(this._player);});
    _signalr.addListener(PlayerEvents.PLAYER_PREPARING, () => { this._player.status = PlayerStatus.preparing; this.setPlayer(this._player);});
    _signalr.addListener(PlayerEvents.PLAYER_READY, () => { this._player.status = PlayerStatus.ready; this.setPlayer(this._player);});
    _signalr.addListener(PlayerEvents.PLAYER_START_PLAY, () => { this._player.status = PlayerStatus.playing; this.setPlayer(this._player);});
  }

  setNickname(nickname: string): void {
  	this._signalr
  		.invoke(ServerFunctions.SAVE_NICKNAME, nickname)
  		.then(player => player ? this.player.next(player) : null);
  }

  updatePlayer(): void {
  	this._signalr.invoke(ServerFunctions.GET_PLAYER, null).then((player) => this.player.next(player));
  }

  setBattlefield(battlefield: Battlefield): void {
    this._signalr.invoke(ServerFunctions.UPDATE_BATTLEFIELD, JSON.stringify(battlefield));
  }

  setPlayer(player: Player): void {
  	this.player.next(player);
  }
}
