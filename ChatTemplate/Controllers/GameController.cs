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
        public GameService gameService { get; set; } = new GameService();

        [HttpGet("[action]")]
        public IEnumerable<GameRoom> GetAllRooms()
        {
            return gameService.GetAllRooms();
        }

        [HttpGet("{id}", Name = "GetRoom")]
        public GameRoom GetRoom(string id)
        {
            return gameService.GetRoomById(id);
        }

        // GET: api/Game
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Game/5
        //[HttpGet("{id}", Name = "Get")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST: api/Game
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/Game/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
