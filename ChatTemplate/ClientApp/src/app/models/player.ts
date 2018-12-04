import { PlayerStatus } from './player-status.enum';

export class Player {
	public id: string;
	public nickname: string = 'Guest';
	public status: PlayerStatus = PlayerStatus.none;
}
