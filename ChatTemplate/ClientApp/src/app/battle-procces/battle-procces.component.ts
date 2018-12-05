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

  public you: Player;
  public yourBattlefield: Battlefield = new Battlefield(new GameConfiguration().FIELD_SIZE);

  public opponent: Player = new Player();
  public opponentBattlefield: Battlefield = new Battlefield(new GameConfiguration().FIELD_SIZE);

  public isYourStep: boolean = false;
  public gameEnd: boolean = false;
  public areYouWinner: boolean;

  public centralMessage: string = 'VS';

  constructor(private _gameService: GameService, private _signalr: SignalRService) {
    this.loadGameRoom();
  	_gameService.player.subscribe(player => this.you = player);
  	_signalr.addListener('playerShootCell', (shoot: Shoot) => this.getShootCell(shoot));
  	_signalr.addListener('opponentDisconnect', () => { this.gameEnd = true; this.areYouWinner = true; this.centralMessage = 'Your opponent left the game!'; });
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
  	});
  }

  makeShootCell(cell: Cell): void {
  	if(!this.gameEnd 
      && this.isYourStep 
      && cell.status != CellStatus.hit 
      && cell.status != CellStatus.miss) {

  		this.isYourStep = undefined;
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

  private checkShipIsDrowned(ship: Ship): boolean {
  	let hits = ship.coordinates.filter(c => c.status == CellStatus.hit).length;
  	if(ship.isDead || hits == ship.size){
  		this.sendSystemMessage('Ship was drowned ' + ShipType[ship.type]);
      return true;
  	}
  }

  private updateShip(cell: Cell, battlefield: Battlefield): void {
  	let ship: Ship = battlefield.ships.find(ship => ship.coordinates.find(c => c.x == cell.x && c.y == cell.y) != null);

  	if(ship != null) {
  		if(this.checkShipIsDrowned(ship)) {
        this.getCellsAround(ship.coordinates, battlefield).forEach(c => c.status = CellStatus.miss);
      }
    }
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

  private checkForEnd(): void {
  	if(this.yourBattlefield.ships.length == this.yourBattlefield.ships.filter(s => s.isDead).length) {
  		// opponent win
  		this.gameEnd = true;
  		this.areYouWinner = false;
  		this.centralMessage = 'Game Over! sorry';
  	} else if (this.opponentBattlefield.ships.length == this.opponentBattlefield.ships.filter(s => s.isDead).length) {
  		// you win
  		this.gameEnd = true;
  		this.areYouWinner = true;
  		this.centralMessage = 'Congratulation! You won!';
    }
  }

  // chat log
  private sendSystemMessage(message: string): void {
  	this._signalr.invoke('systemMessage', message);
  }

  private getCellsAround(points: Cell[], battlefield: Battlefield): Cell[] {
    let cells: Cell[] = points.slice();

    if(this.isCellInRow(cells)) {
      let startCell: Cell = cells[0];
      let endCell: Cell = cells[cells.length - 1];
      cells = [];

      if(startCell.x > 0) {
        startCell = battlefield.cells[startCell.y][startCell.x - 1];
      }

      if(endCell.x < battlefield.cells.length - 1) {
        endCell = battlefield.cells[endCell.y][endCell.x + 1];
      }

      cells.push(startCell);
      cells.push(endCell);

      // add row below
      if(startCell.y > 0) {
        for(let i = startCell.x; i <= endCell.x; i++) {
          cells.push(battlefield.cells[startCell.y - 1][i]);
        }
      }

      // add row under
      if(startCell.y < battlefield.cells.length - 1) {
        for(let i = startCell.x; i <= endCell.x; i++) {
          cells.push(battlefield.cells[startCell.y + 1][i]);
        }
      }
    } 
    else if (this.isCellInColumn(cells)) {
      let startCell: Cell = cells[0];
      let endCell: Cell = cells[cells.length - 1];
      cells = [];

      if(startCell.y > 0) {
        startCell = battlefield.cells[startCell.y - 1][startCell.x];
      }

      if(endCell.y < battlefield.cells.length - 1) {
        endCell = battlefield.cells[endCell.y + 1][endCell.x];
      }

      cells.push(startCell);
      cells.push(endCell);

      // add col left
      if(startCell.x > 0) {
        for(let i = startCell.y; i <= endCell.y; i++) {
          cells.push(battlefield.cells[i][startCell.x - 1]);
        }
      }

      // add col right
      if(startCell.x < battlefield.cells.length - 1) {
        for(let i = startCell.y; i <= endCell.y; i++) {
          cells.push(battlefield.cells[i][startCell.x + 1]);
        }
      }
    }

    return cells;
  }

  private isCellInRow(points: Cell[]): boolean {
    let flag: boolean = true;
    points.sort((a, b) => a.x - b.x);
    for(let i = 1; i < points.length; i++) {
      if(points[i].y != points[i - 1].y || Math.abs(points[i].x - points[i - 1].x) != 1 )
        flag = false;
    }
    return flag;
  }

  private isCellInColumn(points: Cell[]): boolean {
    let flag: boolean = true;
    points.sort((a, b) => a.y - b.y);
    for(let i = 1; i < points.length; i++) {
      if(points[i].x != points[i - 1].x || Math.abs(points[i].y - points[i - 1].y) != 1 )
        flag = false;
    }
    return flag;
  }
}
