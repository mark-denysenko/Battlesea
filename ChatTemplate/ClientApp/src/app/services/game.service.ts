import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { SignalRService } from './signal-r.service';
import { Player } from '../models/player';
import { PlayerStatus } from '../models/player-status.enum';
import { Battlefield } from '../models/battlefield';
import { GameRoom } from '../models/gameroom';

import { GameConfiguration } from '../models/game-configuration';

@Injectable()
export class GameService {

  public player: Subject<Player> = new BehaviorSubject<Player>(new Player());
  
  private _player: Player;

  constructor(private _signalr: SignalRService) {
  	this.player.subscribe(player => this._player = player);
    _signalr.addListener('updatePlayer', (player) => player ? this.player.next(player) : null);
  	_signalr.addListener('joinedToRoom', () => { this._player.status = PlayerStatus.joined; this.setPlayer(this._player);});
    _signalr.addListener('preparing', () => { this._player.status = PlayerStatus.preparing; this.setPlayer(this._player);});
    _signalr.addListener('readyToBattle', () => { this._player.status = PlayerStatus.ready; this.setPlayer(this._player);});
    _signalr.addListener('startPlaying', () => { this._player.status = PlayerStatus.playing; this.setPlayer(this._player);});
  }

  setNickname(nickname: string): void {
  	this._signalr
  		.invoke('savePlayerNickname', nickname)
  		.then(player => player ? this.player.next(player) : null);
  }

  updatePlayer(): void {
  	this._signalr.invoke('getPlayer', null).then((player) => this.player.next(player));
  }

  setBattlefield(battlefield: Battlefield): void {
    this._signalr.invoke('updateBattlefield', JSON.stringify(battlefield));
  }

  setPlayer(player: Player): void {
  	this.player.next(player);
  }
}
