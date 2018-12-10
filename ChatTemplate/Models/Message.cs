using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Battleship.Models
{
    public class Message
    {
        public string Body;
        public string Author;
        public DateTime PostTime;
        public bool IsSystem;
    }
}
