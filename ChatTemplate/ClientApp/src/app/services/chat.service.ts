import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";

@Injectable()
export class ChatService {

  private _hubConnection: HubConnection | undefined;

  public messages: Subject<string> = new Subject<string>();
  public nickname: string = 'Guest';

  constructor() {
  	this._hubConnection = new HubConnectionBuilder()
  								.withUrl('/userchat')
  								.build();

  	this._hubConnection.start();
    this._hubConnection.on('messageReceived', (message: string) => this.messages.next(message));
  }

  public sendMessage(message: string): void {
  	this._hubConnection.invoke('clientMessage', message);
  }

  public addListener(methodName: string, callback: (data, any) => void): void {
  	this._hubConnection.on(methodName, callback);
  }

  public invoke(methodName: string, data: any): Promise<any> {
  	if(this._hubConnection)
  		return this._hubConnection.invoke(methodName, data);
  	return null;
  }

}
