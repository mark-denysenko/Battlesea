import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";

@Injectable()
export class SignalRService {

  private _hubConnection: HubConnection | undefined;

  constructor() {
  	this._hubConnection = new HubConnectionBuilder()
  								.withUrl('/game')
  								.build();
  	this._hubConnection
  		  .start()
        .then(() => console.log('Connection GAME hub started!'))
        .catch(err => console.log('Error while establishing connection GAME hub :('));
  }

  public addListener(methodName: string, callback: (data, any) => void): void {
  	this._hubConnection.on(methodName, callback);
  }

  public invoke(methodName: string, data: any): Promise<any> {
  	if(this._hubConnection) {
  		return this._hubConnection.invoke(methodName, data);
  	}

  	console.log('No connection to GAME (from service)');
  	return null;
  }

  public getConnectionId(): Promise<any> {
    return this._hubConnection.invoke('getConnectionId');
                       //.then(result => { this.connectionId = result; console.log('Connection id: ', this.connectionId)});
  }
}
