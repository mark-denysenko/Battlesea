import { Component, OnInit, Inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  static hubConnection: HubConnection;
  static isConnected: boolean = false;
  nick: string = 'Guest';
  message: string = '';
  messages: string[] = [];
  baseUrl: string;

  constructor(@Inject('BASE_URL') _baseUrl: string) {
    this.baseUrl = _baseUrl;
  }

  ngOnInit() {
    ChatComponent.hubConnection = new HubConnectionBuilder()
        .withUrl("userchat")
        .build();

    this.createConnection();
  }

  public sendMessage(): void {
    this.messages.push(this.createMessage(this.nick, this.message));

    ChatComponent.hubConnection
      .invoke('clientMessage', this.nick, this.message)
      .catch(err => console.error(err));

    this.message = '';
  }

  public saveName() {
    ChatComponent.hubConnection
      .invoke('saveName', this.nick)
      .catch(err => console.error(err));
  }

  private createMessage(nickname: string, message: string): string {
    return nickname + ' : ' + message;
  }

  private createConnection() {
    if (!ChatComponent.isConnected) {
      this.connectionStart();
    }

    ChatComponent.hubConnection.on("messageReceived", (username: string, message: string) => {
      this.messages.push(this.createMessage(username, message));
    });

    //ChatComponent.hubConnection.on("disconnect", this.reconnect);

    //ChatComponent.hubConnection.onclose(this.reconnect);
  }

  private reconnect() {
    ChatComponent.isConnected = false;
    this.messages.push('reconnecting ' + this.nick);
    this.connectionStart();
  }

  private connectionStart() {
    ChatComponent.hubConnection
        .start()
        .then(() => { console.log('Connection started!'); ChatComponent.isConnected = true; })
        .catch(err => console.log('Error while establishing connection :('));
  }
}
