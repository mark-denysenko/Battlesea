using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatTemplate.Models;
using ChatTemplate.Controllers;
using ChatTemplate.Hubs;

namespace ChatTemplate.Services
{
    public class GameService
    {
        private static ICollection<GameRoom> GameRooms = new List<GameRoom>();
        private static ICollection<Player> Players = new List<Player>();

        public GameRoom CreateRoom(string seed)
        {
            string roomId = DateTime.Now.ToLongTimeString()
                + DateTime.Now.Millisecond
                + seed;

            var room = new GameRoom() { RoomId = roomId };
            GameRooms.Add(room);

            return room;
        }

        public bool DeleteRoom(string roomId)
        {
            GameRoom room = GetRoomById(roomId);

            if(room != null)
            {
                 return GameRooms.Remove(room);
            }
            return false;
        }

        public Player CreatePlayer(string id, string nickname = "Guest")
        {
            var player = new Player { Id = id, Nickname = nickname };
            Players.Add(player);
            return player;
        }

        public Player GetOpponent(string playerId)
        {
            GameRoom room = GetRoomByUserId(playerId);

            if(room != null)
            {
                if (room.firstPlayer?.Id == playerId)
                    return room.secondPlayer;
                else
                    return room.firstPlayer;
            }

            return null;
        }

        public void PlayerLeft(string playerId)
        {
            GameRoom room = GetRoomByUserId(playerId);

            if(room != null)
            {
                if (room.firstPlayer?.Id == playerId)
                {
                    room.firstPlayer = null;
                    room.firstBattlefield = null;
                }
                else
                {
                    room.secondPlayer = null;
                    room.secondBattlefield = null;
                }
            }
        }

        public bool DeletePlayer(string id)
        {
            Player player = Players.FirstOrDefault(p => p.Id == id);
            if (player != null)
            {
                return Players.Remove(player);
            }
            return false;
        }

        public GameRoom JoinRoom(string roomId, string connectionId)
        {
            GameRoom room = GetRoomById(roomId);
            Player player = GetPlayerById(connectionId);

            if(room != null && player != null)
            {
                if (room.firstPlayer == null)
                {
                    room.firstPlayer = player;
                    room.firstPlayer.status = PlayerStatus.joined;
                    return room;
                }
                else if (room.secondPlayer == null)
                {
                    room.secondPlayer = player;
                    room.secondPlayer.status = PlayerStatus.joined;
                    return room;
                }
            }
            return null;
        }

        public GameRoom UpdateBattlefield(Battlefield battlefield, string playerId)
        {
            GameRoom room = GetRoomByUserId(playerId);
            if (room.firstPlayer.Id == playerId)
            {
                room.firstBattlefield = battlefield;
                room.firstPlayer.status = PlayerStatus.ready;
            }
            else if (room.secondPlayer.Id == playerId)
            {
                room.secondBattlefield = battlefield;
                room.secondPlayer.status = PlayerStatus.ready;
            }
            return room;
        }

        public Shoot MakeShoot(Cell cell, string playerId)
        {
            GameRoom room = GetRoomByUserId(playerId);
            Cell targetCell = cell;

            if(room != null)
            {
                // one player shoot in another, so need take oposite battlefield
                if(room.firstPlayer.Id == playerId)
                    targetCell = room.secondBattlefield.Cells.ElementAt(cell.y).ElementAt(cell.x);
                else
                    targetCell = room.firstBattlefield.Cells.ElementAt(cell.y).ElementAt(cell.x);

                if (targetCell.status == CellStatus.ship)
                    targetCell.status = CellStatus.hit;
                else
                    targetCell.status = CellStatus.miss;
            }

            return new Shoot { Cell = targetCell, PlayerId = playerId };
        }

        public bool IsTwoPlayers(GameRoom room)
        {
            return room.firstPlayer != null && room.secondPlayer != null;
        }

        public void ExitRoom(string roomId, string connectionId)
        {
            GameRoom room = GetRoomById(roomId);
            if(room?.firstPlayer?.Id == connectionId)
            {
                room.firstPlayer = null;
            }
            else if(room?.secondPlayer?.Id == connectionId)
            {
                room.secondPlayer = null;
            }
        }

        public IEnumerable<Player> GetAllPlayers()
        {
            return Players;
        }

        public Player GetPlayerById(string id)
        {
            return Players.FirstOrDefault(p => p.Id == id);
        }

        public IEnumerable<GameRoom> GetAllRooms()
        {
            return GameRooms;
        }

        public GameRoom GetRoomById(string id)
        {
            return GameRooms.FirstOrDefault(r => r.RoomId == id);
        }

        public GameRoom GetRoomByUserId(string userId)
        {
            return GameRooms.SingleOrDefault(r => r.firstPlayer?.Id == userId || r.secondPlayer?.Id == userId);
        }
    }
}
