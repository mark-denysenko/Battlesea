﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatTemplate.Models
{
    public class Cell
    {
        public int x { get; set; }
        public int y { get; set; }
        public CellStatus status { get; set; }
    }
}
