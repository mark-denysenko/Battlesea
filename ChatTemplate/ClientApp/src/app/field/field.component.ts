import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Battlefield } from '../models/battlefield';
import { CellStatus } from '../models/cell-status.enum';
import { Cell } from '../models/cell';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  CellStatus : typeof CellStatus = CellStatus;

  @Input() field: Battlefield;
  @Input() isOpponent: boolean;
  @Output() cellClick: EventEmitter<Cell> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClickCell(cell: Cell): void {
  	this.cellClick.emit(cell);
  }

}
