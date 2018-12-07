using ChatTemplate.Models;
using ChatTemplate.Services;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatTemplate.Hubs
{
    public class GameHub: Hub
    {
        #region Player events
        private const string START_PLAYING = "startPlaying";
        private const string READY_TO_BATTLE = "readyToBattle";
        private const string PREPARING = "preparing";
        private const string JOINED_TO_ROOM = "joinedToRoom";
        private const string ROOMS_UPDATE = "roomsUpdate";
        private const string UPDATE_PLAYER = "updatePlayer";
        private const string OPPONENT_DISCONNECTED = "opponentDisconnect";
        private const string SHOOT_CELL = "playerShootCell";
        #endregion

        private const string MESSAGE_TO_PLAYER = "messageReceived";

        private GameService _gameService { get; set; } = new GameService();

        public override Task OnConnectedAsync()
        {
            _gameService.CreatePlayer(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            Player opponent = _gameService.GetOpponent(Context.ConnectionId);
            if(opponent != null)
                Clients.Client(opponent.Id).SendAsync(OPPONENT_DISCONNECTED);

            _gameService.RemovePlayerFromRoom(Context.ConnectionId);
            _gameService.DeletePlayer(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

        public async Task CreateRoom(string seed)
        {
            _gameService.CreateRoom(Context.ConnectionId);
            await UpdateClientsRooms();
        }

        public async Task DeleteRoom(string roomId)
        {
            if (_gameService.IsRoomCreator(roomId, Context.ConnectionId))
            {
                _gameService.DeleteRoom(roomId);
                await UpdateClientsRooms();
            }
        }

        public async Task<bool> JoinRoom(string roomId)
        {
            GameRoom room = _gameService.AddPlayerToRoom(roomId, Context.ConnectionId);
            if (room != null)
            {
                Clients.Caller.SendAsync(JOINED_TO_ROOM);
                await UpdateClientsRooms();
                if(room.firstPlayer != null && room.secondPlayer != null)
                {
                    Clients.Client(room.firstPlayer.Id).SendAsync(PREPARING);
                    Clients.Client(room.secondPlayer.Id).SendAsync(PREPARING);
                }
                return true;
            }
            return false;
        }

        public async Task ExitRoom(string roomId)
        {
            _gameService.RemovePlayerFromRoom(Context.ConnectionId);
            UpdateClientsRooms();
        }

        public async Task UpdatePlayer(string connId = null)
        {
            if (connId == null)
                connId = Context.ConnectionId;

            await Clients.Client(connId).SendAsync(UPDATE_PLAYER, _gameService.GetPlayerById(connId));
        }

        public async Task UpdateBattlefield(string battlefieldJson)
        {
            var battlefield = JsonConvert.DeserializeObject<Battlefield>(battlefieldJson);
            GameRoom room = _gameService.UpdateBattlefield(battlefield, Context.ConnectionId);
            await UpdatePlayer();
            if(room.firstBattlefield != null && room.secondBattlefield != null)
            {
                Clients.Client(room.firstPlayer.Id).SendAsync(START_PLAYING);
                Clients.Client(room.secondPlayer.Id).SendAsync(START_PLAYING);
            }
        }

        public async Task UpdateClientsRooms()
        {
            Clients.All.SendAsync(ROOMS_UPDATE, _gameService.GetAllRooms());
        }

        public Player GetPlayer()
        {
            return _gameService.GetPlayerById(Context.ConnectionId);
        }

        public GameRoom GetJoinedRoom(string roomId)
        {
            GameRoom room = _gameService.GetRoomByUserId(Context.ConnectionId);
            return _gameService.GetRoomByUserId(Context.ConnectionId);
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public async Task<Player> SavePlayerNickname(string nickname)
        {
            Player player = _gameService.GetPlayerById(Context.ConnectionId);
            player.Nickname = nickname;

            // Update all rooms for another players, because need to change Nickname in all rooms
            // it helps to fater find room with friend's nickname
            UpdateClientsRooms();
            return player;
        }

        public async Task MakeShoot(Cell cell)
        {
            GameRoom room = _gameService.GetRoomByUserId(Context.ConnectionId);
            Shoot shoot = _gameService.MakeShoot(cell, Context.ConnectionId);

            Clients.Client(room.firstPlayer.Id).SendAsync(SHOOT_CELL, shoot);
            Clients.Client(room.secondPlayer.Id).SendAsync(SHOOT_CELL, shoot);
        }

        #region Chat

        public void SendMessageToAll(string message)
        {
            string senderNickname = _gameService.GetPlayerById(Context.ConnectionId).Nickname;
            Clients.All.SendAsync(MESSAGE_TO_PLAYER, CreateMessage(senderNickname, message));
        }

        public void SystemMessage(string message)
        {
            Clients.Client(Context.ConnectionId).SendAsync(MESSAGE_TO_PLAYER, "!> SYSTEM: " + message);
        }

        private string CreateMessage(string nick, string message)
        {
            return $"> {nick} : {message}";
        }
        #endregion
    }
}
