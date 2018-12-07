export class ServerFunctions {

	public static API_ENDPOINT: string = 'api/Game/';

	public static GET_PLAYER: string = 'getPlayer';
	public static UPDATE_BATTLEFIELD: string = 'updateBattlefield';
	public static SAVE_NICKNAME: string = 'savePlayerNickname';
	public static GET_CONNECTIONID: string = 'getConnectionId';

	// room service
	public static CREATE_ROOM: string = 'createRoom';
	public static JOIN_ROOM: string = 'joinRoom';
	public static EXIT_ROOM: string = 'exitRoom';
	public static DELETE_ROOM: string = 'deleteRoom';
	public static ROOMS_UPDATE_EVENT = 'roomsUpdate';
	public static GET_JOINED_ROOM = 'getJoinedRoom';

	// game process
	public static MAKE_SHOOT: string = 'makeShoot';

	// chat
	public static SYSTEM_MESSAGE: string = 'systemMessage';
	public static SEND_MESSAGE: string = 'sendMessageToAll';

	// Listeners
	public static GET_SHOOT: string = 'playerShootCell';
	public static OPPONENT_DISCONNECT: string = 'opponentDisconnect';
}
