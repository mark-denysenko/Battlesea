import { CellStatus } from './cell-status.enum';
import { Cell } from './cell';
import { Ship } from './ship';

export class Battlefield {

	public cells: Cell[][] = [];
	public ships: Ship[] = [];

	constructor(fieldSize: number) {
        for(let i: number = 0; i < fieldSize; i++) {
            this.cells[i] = [];
            for(let j: number = 0; j < fieldSize; j++) {
                this.cells[i][j] = new Cell(j, i);
                this.cells[i][j].status = CellStatus.clear;
            }
        }
	}
}
