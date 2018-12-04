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
        #endregion

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
                Clients.Client(opponent.Id).SendAsync("opponentDisconnect");

            _gameService.PlayerLeft(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

        public async Task CreateRoom(string seed)
        {
            _gameService.CreateRoom(Context.ConnectionId);
            await UpdateClientsRooms();
        }

        public async Task DeleteRoom(string roomId)
        {
            _gameService.DeleteRoom(roomId);
            await UpdateClientsRooms();
        }

        public async Task<bool> JoinRoom(string roomId)
        {
            GameRoom room = _gameService.JoinRoom(roomId, Context.ConnectionId);
            if (room != null)
            {
                Clients.Caller.SendAsync(JOINED_TO_ROOM);
                await UpdateClientsRooms();
                if(_gameService.IsTwoPlayers(room))
                {
                    await Clients.Client(room.firstPlayer.Id).SendAsync(PREPARING);
                    await Clients.Client(room.secondPlayer.Id).SendAsync(PREPARING);
                }
                return true;
            }
            return false;
        }

        public async Task ExitRoom(string roomId)
        {
            _gameService.ExitRoom(roomId, Context.ConnectionId);
            await UpdateClientsRooms();
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
                await Clients.Client(room.firstPlayer.Id).SendAsync(START_PLAYING);
                await Clients.Client(room.secondPlayer.Id).SendAsync(START_PLAYING);
            }
        }

        public async Task UpdateClientsRooms()
        {
            await Clients.All.SendAsync(ROOMS_UPDATE, _gameService.GetAllRooms());
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
            if(player != null)
            {
                player.Nickname = nickname;
            }
            else
            {
                player = _gameService.CreatePlayer(Context.ConnectionId, nickname);
            }
            await UpdateClientsRooms();
            return player;
        }

        public async Task MakeShoot(Cell cell)
        {
            GameRoom room = _gameService.GetRoomByUserId(Context.ConnectionId);
            Shoot shoot = _gameService.MakeShoot(cell, Context.ConnectionId);

            await Clients.Client(room.firstPlayer.Id).SendAsync("playerShootCell", shoot);
            await Clients.Client(room.secondPlayer.Id).SendAsync("playerShootCell", shoot);
        }

        #region Chat

        public void SendMessageToAll(string message)
        {
            string senderNickname = _gameService.GetPlayerById(Context.ConnectionId).Nickname;
            Clients.All.SendAsync("messageReceived", CreateMessage(senderNickname, message));
        }

        public void SystemMessage(string message)
        {
            Clients.Client(Context.ConnectionId).SendAsync("messageReceived", "!> SYSTEM: " + message);
        }

        private string CreateMessage(string nick, string message)
        {
            return $"> {nick} : {message}";
        }
        #endregion
    }
}
