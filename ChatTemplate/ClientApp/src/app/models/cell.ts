import { CellStatus } from './cell-status.enum';

export class Cell {

  public x: number;
  public y: number;
  public status: CellStatus;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.status = CellStatus.clear;
  }
}
