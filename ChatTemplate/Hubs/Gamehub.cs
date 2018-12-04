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
        private const string startPlaying = "startPlaying";
        private const string readyToBattle = "readyToBattle";
        private const string preparing = "preparing";
        private const string joinedToRoom = "joinedToRoom";
        private const string roomsUpdate = "roomsUpdate";
        private const string updatePlayer = "updatePlayer";

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

        public bool JoinRoom(string roomId)
        {
            GameRoom room = _gameService.JoinRoom(roomId, Context.ConnectionId);
            if (room != null)
            {
                Clients.Caller.SendAsync(joinedToRoom);
                UpdateClientsRooms();
                if(_gameService.IsTwoPlayers(room))
                    InvokeReadyToPreparing(room);
                return true;
            }
            return false;
        }

        public async Task ExitRoom(string roomId)
        {
            _gameService.ExitRoom(roomId, Context.ConnectionId);
            await UpdateClientsRooms();
        }

        public async Task InvokeReadyToPreparing(GameRoom room)
        {
            await Clients.Client(room.firstPlayer.Id).SendAsync(preparing);
            await Clients.Client(room.secondPlayer.Id).SendAsync(preparing);
        }

        public async Task UpdatePlayer(string connId = null)
        {
            if (connId == null)
                connId = Context.ConnectionId;

            await Clients.Client(connId).SendAsync(updatePlayer, _gameService.GetPlayerById(connId));
        }

        public async Task UpdateBattlefield(string battlefieldJSON)
        {
            Battlefield battlefield = JsonConvert.DeserializeObject<Battlefield>(battlefieldJSON);
            GameRoom room = _gameService.UpdateBattlefield(battlefield, Context.ConnectionId);
            await UpdatePlayer();
            if(room.firstBattlefield != null && room.secondBattlefield != null)
            {
                await Clients.Client(room.firstPlayer.Id).SendAsync(startPlaying);
                await Clients.Client(room.secondPlayer.Id).SendAsync(startPlaying);
            }
        }

        public async Task UpdateClientsRooms()
        {
            await Clients.All.SendAsync(roomsUpdate, _gameService.GetAllRooms());
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

        //public void SystemMessage(string message, string connId)
        //{
        //    Clients.Client(connId).SendAsync("messageReceived", "!> SYSTEM: " + message);
        //}

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
