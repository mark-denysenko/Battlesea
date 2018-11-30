using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatTemplate.Models
{
    public class Battlefield
    {
        public ICollection<ICollection<Cell>> Cells { get; set; }
        public ICollection<Ship> Ships { get; set; }
    }
}
