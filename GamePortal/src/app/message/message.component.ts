import {Component, Input, OnInit} from '@angular/core';
import {ChatMessage} from '../models/chat_message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() chatMessage: ChatMessage;
  userid: string;
  message: string;
  timestamp: Date;
  constructor() { }

  ngOnInit(chatMessage = this.chatMessage) {
    this.message = chatMessage.message;
    this.timestamp = chatMessage.timestamp;
    this.userid = chatMessage.senderUid; // may want to have displayname
  }
}
