import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Cell } from '../models/cell';
import { Battlefield } from '../models/battlefield';
import { CellStatus } from '../models/cell-status.enum';
import { ShipType } from '../models/ship-type';
import { Ship } from '../models/ship';
import { GameConfiguration } from '../models/game-configuration';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'app-preparing',
  templateUrl: './preparing.component.html',
  styleUrls: ['./preparing.component.css']
})
export class PreparingComponent implements OnInit {
  CellStatus : typeof CellStatus = CellStatus;
  ShipType: typeof ShipType = ShipType;

  @Output() readyFunction: EventEmitter<Battlefield> = new EventEmitter();

  battlefield: Battlefield;
  gameConfiguration: GameConfiguration = new GameConfiguration();

  selectedCells: Cell[] = [];
  selectedType: ShipType = ShipType.submarine;
  errorMessage: string = '';

  constructor(private _signalr: SignalRService) {
  	this.battlefield = new Battlefield(this.gameConfiguration.FIELD_SIZE);
  }

  ngOnInit() {
  }

  cellClick(cell: Cell): void {
  	if(cell.status == CellStatus.clear) {
  	  let newSelectedCells: Cell[] = this.selectedCells.slice();
  	  newSelectedCells.push(cell);
  	  if((this.isCellInColumn(newSelectedCells) || this.isCellInRow(newSelectedCells))) {
	      cell.status = CellStatus.selected;
	  	  this.selectedCells.push(cell);
	   }
	   else {
	   	this.sendErrorMessage('Selected cell stay not in a row or a column with another, or stay near another ship!');
	   }
	} else if (cell.status == CellStatus.selected) {
		cell.status = CellStatus.clear;
		this.selectedCells = this.selectedCells.filter(c => c.status == CellStatus.selected);
	} else {
	    this.sendErrorMessage('Select free cell!');
	}
  }

  selectType(type): void {
  	switch (type) {
  		case 'destroyer':
  			this.selectedType = ShipType.destroyer;
  			break;
  		case 'cruiser':
  			this.selectedType = ShipType.cruiser;
  			break;
  		case 'battleship':
  			this.selectedType = ShipType.battleship;
  			break;
  		case 'submarine':
  		default:
  			this.selectedType = ShipType.submarine;
  			break;
  	}
  }

  createShip(): void {
  	if(this.getCurrentNumberOfShipsByType(this.selectedType) >= this.getMaxNumberOfShipType(this.selectedType)) {
  		this.sendErrorMessage('You created max number ships of this type!');
  		return;
  	}

  	let points = this.selectedCells;
  	if(points.length == this.getSizeOfShipType(this.selectedType)) {
  		for(let i = 0; i < points.length; i++) {
  			points[i].status = CellStatus.ship;
  		}
  		this.battlefield.ships.push(new Ship(points, this.selectedType));
  		this.selectedCells = [];
  	} else {
  		this.sendErrorMessage('Cannot create');
  	}
  }

  isAllShipsSet(): boolean {
  	return this.getMaxNumberAllShips() == this.battlefield.ships.length;
  }

  readyToBattle(): void {
  	if(this.isAllShipsSet()) {
  		this.readyFunction.emit(this.battlefield);
  	}
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

  private sendErrorMessage(message: string): void {
  	this.errorMessage = message;
  }

  public getCurrentNumberOfShipsBySize(size: number): number {
  	return this.battlefield.ships.filter(ship => ship.size == size).length;
  }

  private getCurrentNumberOfShipsByType(type: ShipType): number {
  	return this.battlefield.ships.filter(ship => ship.type == type).length;
  }

  private getSizeOfShipType(type): number {
  	switch (type) {
  		case ShipType.submarine:
  			return this.gameConfiguration.SIZE_SUBMARINE;
  		case ShipType.destroyer:
  			return this.gameConfiguration.SIZE_DESTROYER;
  		case ShipType.cruiser:
  			return this.gameConfiguration.SIZE_CRUISER;
  		case ShipType.battleship:
  			return this.gameConfiguration.SIZE_BATTLESHIP;
  			default:
  		return -1;
  	}
  }

  private getMaxNumberOfShipType(type): number {
  	switch (type) {
  		case ShipType.submarine:
  			return this.gameConfiguration.NUMBER_SUBMARINE;
  		case ShipType.destroyer:
  			return this.gameConfiguration.NUMBER_DESTROYER;
  		case ShipType.cruiser:
  			return this.gameConfiguration.NUMBER_CRUISER;
  		case ShipType.battleship:
  			return this.gameConfiguration.NUMBER_BATTLESHIP;
  			default:
  		return -1;
  	}
  }

  private getMaxNumberAllShips(): number {
  	let maxNumber: number = 0;
  	maxNumber += this.getMaxNumberOfShipType(ShipType.submarine);
  	maxNumber += this.getMaxNumberOfShipType(ShipType.destroyer);
  	maxNumber += this.getMaxNumberOfShipType(ShipType.cruiser);
  	maxNumber += this.getMaxNumberOfShipType(ShipType.battleship);
  	return maxNumber;
  }
}
