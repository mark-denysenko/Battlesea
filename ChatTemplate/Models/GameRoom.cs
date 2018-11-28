using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatTemplate.Models
{
    public class GameRoom
    {
        public string RoomId { get; set; }

        public Player firstPlayer { get; set; }
        public Battlefield firstBattledield { get; set; }

        public Player secondPlayer { get; set; }
        public Battlefield secondBattlefield { get; set; }
    }
}
