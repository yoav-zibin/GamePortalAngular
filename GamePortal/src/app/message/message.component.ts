import {Component, Input, OnInit} from '@angular/core';
import {ChatMessage} from '../models/chat_message';
import {AuthService} from '../services/auth.service';;
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() chatMessage: ChatMessage;
  userid: string;
  message: string;
  timestamp: any;
  username: string;
  isOwnMessage: boolean;
  constructor(private af: AngularFireDatabase, private authService: AuthService) {
    // this.isOwnMessage = authService.authUser().uid === this.userid;
    this.isOwnMessage = true;
  }

  ngOnInit(chatMessage = this.chatMessage) {
    this.message = chatMessage.message;
    this.timestamp = chatMessage.timestamp;
    this.userid = chatMessage.senderUid; // may want to have displayname
    this.af.database.ref('users/' + this.userid + '/publicFields/displayName').once('value').then( res => {
      this.username = res.val();
    });
  }
}
