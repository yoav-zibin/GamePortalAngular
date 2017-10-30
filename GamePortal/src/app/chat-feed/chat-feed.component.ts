import {Component, OnChanges, OnInit} from '@angular/core';
import { ChatService} from '../services/chat.service';
import { ChatMessage } from '../models/chat_message';
import {AngularFireList} from 'angularfire2/database';

@Component({
  selector: 'app-chat-feed',
  templateUrl: './chat-feed.component.html',
  styleUrls: ['./chat-feed.component.css']
})
export class ChatFeedComponent implements OnInit, OnChanges {

  feed: AngularFireList<ChatMessage[]>;
  constructor(private chat: ChatService) {
  }

  ngOnInit() {
    this.feed = this.chat.getMessageHistory();
  }

  ngOnChanges(changes: SimpleChanges): void {
    throw new Error("Method not implemented.");
  }
}
