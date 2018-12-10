import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { SignalRService } from '../services/signal-r.service';
import { ServerFunctions } from '../services/server-functions';
import { Message } from './message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public message: string = '';
  public messages: Message[] = [];

  constructor(private _chatService: SignalRService) {
    _chatService.addListener('messageReceived', message => { this.messages.push(message); setTimeout(() => this.scrollMessageToBottom(), 0)});
  }

  ngOnInit() {
  }

  public sendMessage(): void {
    if(this.message.trim() != '')
      this._chatService.invoke(ServerFunctions.SEND_MESSAGE, this.message);

    var messageHolder = document.getElementById('messageHolder');
    messageHolder.focus();
    this.message = '';
  }

  public scrollMessageToBottom(): void {
    var obj = document.getElementById('divMessages');
    obj.scrollTop = obj.scrollHeight;
  }

  public createMessage(mess: Message): string {
    let myMoment: moment.Moment = moment(mess.postTime);
    return "" + myMoment.format('h:mm:ss') + ' > ' + mess.author + ' : '  + mess.body;
  }
}
