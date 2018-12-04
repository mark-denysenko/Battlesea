using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatTemplate.Models;
using ChatTemplate.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ChatTemplate.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        public GameService GameService { get; set; } = new GameService();

        [HttpGet("[action]")]
        public IEnumerable<GameRoom> GetAllRooms()
        {
            return GameService.GetAllRooms();
        }

        [HttpGet("{id}", Name = "GetRoom")]
        public GameRoom GetRoom(string id)
        {
            return GameService.GetRoomById(id);
        }
    }
}
