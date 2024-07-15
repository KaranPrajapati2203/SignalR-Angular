import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private messageSubject = new Subject<{ user: string, message: string }>();
  public message$ = this.messageSubject.asObservable();
  private readonly apiUrl = 'https://localhost:7163/api/Chat/messages';

  constructor(private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7163/chatHub')
      .build();

    this.hubConnection.on('ReceiveMessage', (user, message) => {
      console.log(`Received message: ${user}: ${message}`);
      this.messageSubject.next({ user, message });
    });

    this.hubConnection.start().then(() => {
      console.log('SignalR connection established.');
    }).catch((err: any) => {
      console.error('SignalR connection error:', err.toString());
    });
  }

  public sendMessage(user: string, message: string) {
    this.hubConnection.invoke('SendMessage', user, message).catch((err: any) => {
      console.error('Error sending message:', err.toString());
    });
  }

  public getMessages() {
    return this.http.get<{ user: string, message: string }[]>(this.apiUrl);
  }
}
