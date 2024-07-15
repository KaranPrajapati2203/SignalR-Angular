import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../../services/signalr.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  user = '';
  message = '';
  messages: { user: string, message: string }[] = [];

  constructor(private signalRService: SignalrService) {
    this.signalRService.message$.subscribe(msg => {
      this.messages.push(msg);
    });
  }

  ngOnInit(): void {
    this.signalRService.getMessages().subscribe(messages => {
      console.log("messages: " + JSON.stringify(messages));
      this.messages = messages;
    });
  }

  sendMessage(): void {
    if (this.user.trim() && this.message.trim()) {
      this.signalRService.sendMessage(this.user, this.message);
      this.message = '';
    }
  }
}
