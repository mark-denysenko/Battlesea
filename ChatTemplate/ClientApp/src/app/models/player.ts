import { PlayerStatus } from './player-status.enum';

export class Player {
	id: string;
	nickname: string = 'Guest';
	status: PlayerStatus = PlayerStatus.none;
}
