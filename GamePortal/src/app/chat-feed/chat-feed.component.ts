import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { ChatService} from '../services/chat.service';
import { ChatMessage } from '../models/chat_message';
import {AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-chat-feed',
  templateUrl: './chat-feed.component.html',
  styleUrls: ['./chat-feed.component.css']
})
export class ChatFeedComponent implements OnInit, OnChanges {

  feed: Observable<any>;
  constructor(private chat: ChatService) {
  }

  ngOnInit() {
    // this feed should be update whenever a new message gets posted
    let message_observe = this.chat.getMessageHistory();
    if (message_observe === null) {
      this.feed = null;
    } else {
      this.feed = message_observe.valueChanges();
    }
  }
  ngOnChanges() {
    // TODO: this function is async and always update feed?
    let message_observe = this.chat.getMessageHistory();
    if (message_observe === null) {
      this.feed = null;
    } else {
      this.feed = message_observe.valueChanges();
    }
  }
}
