import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";
import { ServerFunctions } from './server-functions';

@Injectable()
export class SignalRService {

  private _hubConnection: HubConnection | undefined;

  constructor() {
  	this._hubConnection = new HubConnectionBuilder()
  								.withUrl('/game')
  								.build();
  	this.startConnection();
  }

  public addListener(methodName: string, callback: (data, any) => void): void {
  	this._hubConnection.on(methodName, callback);
  }

  public invoke(methodName: string, data: any): Promise<any> {
  	if(this._hubConnection)
  		return this._hubConnection.invoke(methodName, data);
  	return null;
  }

  public getConnectionId(): Promise<any> {
    return this._hubConnection.invoke(ServerFunctions.GET_CONNECTIONID);
  }

  private startConnection(): any {  
    this._hubConnection.start().then( () => {  
      console.log('Connection started');  
    }).catch(err => {  
      console.error(err);  
      setTimeout(this.startConnection(), 5000);  
    });  
  }
}
