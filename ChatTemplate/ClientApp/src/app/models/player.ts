import { PlayerStatus } from './player-status.enum';

export class Player {
	id: string;
	nickname: string = 'Guest';
	score: number = 0;

	status: PlayerStatus;
}
