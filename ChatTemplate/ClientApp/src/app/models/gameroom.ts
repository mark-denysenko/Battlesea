import { Player } from './player';
import { Battlefield } from './battlefield';

export class GameRoom {
	firstPlayer: Player;
	firstBattledield: Battlefield;

	secondPlayer: Player;
	secondBattlefield: Battlefield;

	roomId: string;
}
