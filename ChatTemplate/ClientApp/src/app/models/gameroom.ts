import { Player } from './player';
import { Battlefield } from './battlefield';

export class GameRoom {
	public roomId: string;

	public firstPlayer: Player;
	public firstBattlefield: Battlefield;

	public secondPlayer: Player;
	public secondBattlefield: Battlefield;
}
