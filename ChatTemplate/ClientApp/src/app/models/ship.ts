import { ShipType } from './ship-type';
import { Cell } from './cell';

export class Ship {
  
  public type: ShipType;
  public size: number;
  public hits: number;
  public coordinates: Cell[];
  public isDead: boolean;

  constructor(points: Cell[], type: ShipType = null) {
    this.type = type;
    this.coordinates = points;
    this.size = points.length;
    this.hits = 0;
    this.isDead = false;
  }
}
