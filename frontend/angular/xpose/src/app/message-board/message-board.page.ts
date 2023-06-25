import { Component, OnInit } from '@angular/core';

interface Message {
  user: string;
  content: string;
}

@Component({
  selector: 'app-message-board',
  templateUrl: './message-board.page.html',
  styleUrls: ['./message-board.page.scss'],
})
export class MessageBoardPage implements OnInit {
  messages: Message[] = [];
  newMessage!: string;

  constructor() { }

  ngOnInit() {
  }

  createMessage() {
    if (this.newMessage) {
      // Assume 'John' is the user who typed the message, you can replace it with the actual user information.
      const message: Message = {
        user: 'John',
        content: this.newMessage
      };

      this.messages.push(message);
      this.newMessage = '';
    }
  }
}
