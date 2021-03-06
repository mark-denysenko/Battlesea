﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatTemplate.Models
{
    public class Player
    {
        public string Id { get; set; }
        public string Nickname { get; set; } = "Guest";
        public PlayerStatus status { get; set; } = PlayerStatus.none;
    }
}
