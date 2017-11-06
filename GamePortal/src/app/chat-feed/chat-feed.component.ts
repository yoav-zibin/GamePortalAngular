import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { ChatService} from '../services/chat.service';
import { ChatMessage } from '../models/chat_message';
import {AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {GroupService} from '../services/group.service';

@Component({
  selector: 'app-chat-feed',
  templateUrl: './chat-feed.component.html',
  styleUrls: ['./chat-feed.component.css']
})
export class ChatFeedComponent implements OnInit, OnChanges {

  @Input() groupId: Observable<any>;
  feed: Observable<any>;
  constructor(private chat: ChatService, private groupService: GroupService) {
  }

  ngOnInit() {
    // this feed should be update whenever a new message gets posted
    // console.log('diyigeyouma?dfasf?', this.groupId);
    this.groupId.subscribe(gid => {
      // console.log('diyigeyouma?', gid);
      const message_observe = this.chat.getMessageHistory(gid);
      this.feed = message_observe.valueChanges();
    });
  }
  ngOnChanges() {
    // TODO: this function is async and always update feed?
    this.groupId.subscribe(gid => {
      const message_observe = this.chat.getMessageHistory(gid);
      this.feed = message_observe.valueChanges();
    });
  }
}
