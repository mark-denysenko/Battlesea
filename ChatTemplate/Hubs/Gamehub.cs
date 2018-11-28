using ChatTemplate.Models;
using ChatTemplate.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatTemplate.Hubs
{
    public class GameHub: Hub
    {
        private GameService _gameService { get; set; } = new GameService();

        public override Task OnConnectedAsync()
        {
            _gameService.CreatePlayer(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
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
            _gameService.DeleteRoom(roomId);
            await UpdateClientsRooms();
        }

        public bool JoinRoom(string roomId)
        {
            GameRoom room = _gameService.JoinRoom(roomId, Context.ConnectionId);
            if (room != null)
            {
                Clients.Caller.SendAsync("joinedToRoom");
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
            await Clients.Client(room.firstPlayer.Id).SendAsync("preparing");
            await Clients.Client(room.secondPlayer.Id).SendAsync("preparing");
        }

        public async Task UpdateClientsRooms()
        {
            await Clients.All.SendAsync("roomsUpdate");
        }

        public Player GetPlayer()
        {
            return _gameService.GetPlayerById(Context.ConnectionId);
        }

        public GameRoom GetJoinedRoom()
        {
            return _gameService.GetRoomByUserId(Context.ConnectionId);
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public async Task SavePlayerNickname(string nickname)
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
        }
    }
}
