import { CellStatus } from './cell-status.enum';

export class Cell {

  x: number;
  y: number;
  status: CellStatus;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.status = CellStatus.clear;
  }
}
