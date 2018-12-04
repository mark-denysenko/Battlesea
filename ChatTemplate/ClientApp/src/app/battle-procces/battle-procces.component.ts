import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../models/player';
import { CellStatus } from '../models/cell-status.enum';
import { Cell } from '../models/cell';
import { ShipType } from '../models/ship-type';
import { Ship } from '../models/ship';
import { Shoot } from '../models/shoot';
import { Battlefield }  from '../models/battlefield';
import { GameRoom } from '../models/gameroom';
import { GameService } from '../services/game.service';
import { SignalRService } from '../services/signal-r.service';
import { GameConfiguration } from '../models/game-configuration';

@Component({
  selector: 'app-battle-procces',
  templateUrl: './battle-procces.component.html',
  styleUrls: ['./battle-procces.component.css']
})
export class BattleProccesComponent implements OnInit {
  ShipType: typeof ShipType = ShipType;
  CellStatus : typeof CellStatus = CellStatus;
  // shoots: Observable<Shoot> = new Observable<Shoot>();
  shoots: Shoot[] = [];

  you: Player;
  yourBattlefield: Battlefield = new Battlefield(new GameConfiguration().FIELD_SIZE);

  opponent: Player = new Player();
  opponentBattlefield: Battlefield = new Battlefield(new GameConfiguration().FIELD_SIZE);

  isYourStep: boolean = false;
  gameEnd: boolean = false;
  areYouWinner: boolean;

  stepTime: number = new GameConfiguration().STEP_TIME;
  centralMessage: string = 'VS';
  currentRoom: GameRoom;

  constructor(private _gameService: GameService, private _signalr: SignalRService) {
  	_gameService.player.subscribe(player => this.you = player);
  	this.loadGameRoom();
  	this._signalr.addListener('playerShootCell', (shoot: Shoot) => this.getShootCell(shoot));
  	this._signalr.addListener('opponentDisconnect', () => { this.gameEnd = true; this.areYouWinner = true; this.centralMessage = 'Your opponent left the game!'; });
  }

  ngOnInit() {
  }

  loadGameRoom(): void {
  	this._signalr.invoke("getJoinedRoom", null).then(gameRoom => 
  	{
  		if(gameRoom.firstPlayer.id == this.you.id) {
  			this.yourBattlefield = gameRoom.firstBattlefield;
  			this.opponentBattlefield = gameRoom.secondBattlefield;
  			this.opponent = gameRoom.secondPlayer;

  			this.isYourStep = true;
  			this.sendSystemMessage('Game is ready! You have the first step!');
  		} else {
  			this.yourBattlefield = gameRoom.secondBattlefield;
  			this.opponentBattlefield = gameRoom.firstBattlefield;
  			this.opponent = gameRoom.firstPlayer;

  			this.isYourStep = false;
  			this.sendSystemMessage('Game is ready! You have the second step!');
  		}
  		this.currentRoom = gameRoom;
  	});
  }

  makeShootCell(cell: Cell): void {
  	if(!this.gameEnd && this.isYourStep && cell.status != CellStatus.hit && cell.status != CellStatus.miss) {
  		this.isYourStep = false;
  		this._signalr.invoke('makeShoot', cell);
  	}
  }

  getShootCell(shoot: Shoot): void {
  	if(shoot.playerId == this.you.id) {
  		this.sendSystemMessage('Shoot in opponent (' + shoot.cell.x + ',' + shoot.cell.y + ')');
  		this.opponentBattlefield.cells[shoot.cell.y][shoot.cell.x] = shoot.cell;
  		this.updateShips(this.opponentBattlefield);
  		this.updateShip(shoot.cell, this.opponentBattlefield);
  	} else {
  		this.sendSystemMessage('opponent shoot in (' + shoot.cell.x + ',' + shoot.cell.y + ')');
  		this.yourBattlefield.cells[shoot.cell.y][shoot.cell.x] = shoot.cell;
  		this.updateShips(this.yourBattlefield);
  		this.updateShip(shoot.cell, this.yourBattlefield);
  	}

  	if(shoot.cell.status == CellStatus.hit && this.you.id == shoot.playerId)
  		this.isYourStep = true;
  	else if(shoot.cell.status == CellStatus.miss && this.opponent.id == shoot.playerId)
  		this.isYourStep = true;
  	else 
  		this.isYourStep = false;

  	this.checkForEnd();
  }

  private checkShipIsDrowned(ship: Ship) {
  	let hits = ship.coordinates.filter(c => c.status == CellStatus.hit).length;
  	if(ship.isDead || hits == ship.size){
  		this.sendSystemMessage('Ship was drowned ' + ShipType[ship.type]);
  		//console.log('Ship was drowned ', ship);
  	}
  }

  private updateShip(cell: Cell, battlefield: Battlefield): void {
  	let ship: Ship = battlefield.ships.find(ship => ship.coordinates.find(c => c.x == cell.x && c.y == cell.y) != null);

  	if(ship != null)
  		this.checkShipIsDrowned(ship);
  }

  private updateShips(battlefield: Battlefield): void {
  	battlefield.ships.forEach(ship => {
  		ship.coordinates.forEach(cell => {
  			cell.status = battlefield.cells[cell.y][cell.x].status
  		});
  		ship.hits = ship.coordinates.filter(c => c.status == CellStatus.hit).length;
  		if(ship.hits == ship.size) {
  			ship.isDead = true;
  		}
  	});
  }

  private checkForEnd(): boolean {
  	if(this.yourBattlefield.ships.length == this.yourBattlefield.ships.filter(s => s.isDead).length) {
  		// opponent win
  		this.gameEnd = true;
  		this.areYouWinner = false;
  		this.centralMessage = 'Game Over! sorry';
  		return true;
  	} else if (this.opponentBattlefield.ships.length == this.opponentBattlefield.ships.filter(s => s.isDead).length) {
  		// you win
  		this.gameEnd = true;
  		this.areYouWinner = true;
  		this.centralMessage = 'Congratulation! You won!';
  		return true;
  	} else {
  		return false;
  	}
  }

  // chat log
  private sendSystemMessage(message: string): void {
  	this._signalr.invoke('systemMessage', message);
  }
}
