using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatTemplate.Models
{
    public class Ship
    {
        public ShipType type { get; set; }
        public int size { get; set; }
        public int hits { get; set; }
        public ICollection<Cell> coordinates { get; set; }
        public bool isDead { get; set; }
    }
}
