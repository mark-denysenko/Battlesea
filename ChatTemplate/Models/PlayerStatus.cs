using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatTemplate.Models
{
    public enum PlayerStatus
    {
        none = 0,
        joined = 1,
        preparing = 2,
        ready = 3,
        playing = 4,
        disconnected = 5
    }
}
