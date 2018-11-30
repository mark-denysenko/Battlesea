import { ShipType } from './ship-type';
import { Cell } from './cell';

export class Ship {
  
  type: ShipType;
  size: number;
  hits: number;
  coordinates: Cell[];
  isDead: boolean;

  constructor(points: Cell[], type: ShipType = null) {
    this.type = type;
    // switch (this.type) {
    //   case 1: { this.size = 1; break; }
    //   case 2: { this.size = 2; break; }
    //   case 3: { this.size = 3; break; }
    //   case 4: { this.size = 4; break; }
    // }
    this.coordinates = points;
    this.size = points.length;
    this.hits = 0;
    this.isDead = false;
  }
}
