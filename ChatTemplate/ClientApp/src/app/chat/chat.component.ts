import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  message: string = '';
  messages: string[] = [];

  constructor(private _chatService: SignalRService) {
    _chatService.addListener('messageReceived', message => this.messages.push(message));
  }

  ngOnInit() {
  }

  public sendMessage(): void {
    this._chatService.invoke('sendMessageToAll', this.message);
    this.message = '';
  }

  // private createMessage(nickname: string, message: string): string {
  //   return nickname + ' : ' + message;
  // }
}
