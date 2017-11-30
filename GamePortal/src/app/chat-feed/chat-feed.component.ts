import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { ChatService} from '../services/chat.service';
import { ChatMessage } from '../models/chat_message';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {GroupService} from '../services/group.service';

@Component({
  selector: 'app-chat-feed',
  templateUrl: './chat-feed.component.html',
  styleUrls: ['./chat-feed.component.css']
})
export class ChatFeedComponent implements OnInit, OnChanges {
  // participants: any;
  // groupName: any;
  feed: Observable<any>;
  @Input() gid: any;
  constructor(private chat: ChatService, private af: AngularFireDatabase, private groupService: GroupService) {

  }

  ngOnChanges(): void {
    this.feed = this.chat.getMessageHistory(this.gid).valueChanges();
  }

  ngOnInit(): void {
    this.feed = this.chat.getMessageHistory(this.gid).valueChanges();
  }

}
