using ChatTemplate.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatTemplate.Hubs
{
    //[Route("/chat")]
    public class ChatHub: Hub
    {
        public static ICollection<User> Users = new List<User>();

        public override Task OnConnectedAsync()
        {
            Users.Add(new User { Id = Context.ConnectionId });
            SendToAll("admin", "join " + Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public async void SaveName(string name)
        {
            Users.FirstOrDefault(u => u.Id == Context.ConnectionId).Nickname = name;
            await SendToAll("admin", "change name " + Users.FirstOrDefault(u => u.Id == Context.ConnectionId).Nickname);
        }

        public async Task ClientMessage(string username, string message)
        {
            await Clients.Others.SendAsync("messageReceived", username, message);
        }

        public async Task SendToAll(string name, string message)
        {
            await Clients.All.SendAsync("messageReceived", name, message);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            User user = Users.FirstOrDefault(u => u.Id == Context.ConnectionId);
            if (user != null)
            {
                SendToAll("admin", "left " + Context.ConnectionId);
                Users.Remove(user);
            }

            Clients.Caller.SendAsync("disconnect");

            return base.OnDisconnectedAsync(exception);
        }
    }
}
