using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatTemplate.Models
{
    public enum CellStatus
    {
        clear = 0,
        selected = 1,
        ship = 2,
        miss = 3,
        hit = 4,
    }
}
