import { Player } from './player';
import { Battlefield } from './battlefield';

export class GameRoom {
	firstPlayer: Player;
	firstBattlefield: Battlefield;

	secondPlayer: Player;
	secondBattlefield: Battlefield;

	roomId: string;
}
