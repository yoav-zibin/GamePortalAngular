import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ChatMessage } from '../models/chat_message';
import { Observable } from 'rxjs/Observable';
// import {User} from '../models/user';
import {GroupService} from './group.service';
import {AuthService} from './auth.service';

// TODO: groupid, participants, index;
@Injectable()
export class ChatService {
  // should have a group id:
  // when the current user select a group chat
  // open the corresponding chat room
  user: any;
  testGroupId = 'ttest';
  public curtUserId: string;
  chatMessages: AngularFireList<ChatMessage>;
  constructor(private authService: AuthService,
              private af: AngularFireDatabase,
              private groupService: GroupService) {
    this.curtUserId = this.authService.curtUserId; // undefined at first.
    // console.log('the current auth uid: ', this.curtUserId);
  }

  getUsers() {
    const path = '/gamePortal/recentlyConnected';
    // console.log('ready to fetch users');
    return this.af.list(path);
  }

  getMessageHistory(gid): any {
    // for showing feed
    // test group id:
    // console.log('fetching history for: ', gid);
    return this.af.list('gamePortal/groups/' + gid + '/messages', ref => {
      return ref.limitToLast(20).orderByKey();
    });
    // if (!this.curtGroupId) {
    //   return null;
    // }
  }

  sendMessage(msg: string) {
    // group id? ref?
    //  according to our group chat rules:
    const TimeStamp = firebase.database.ServerValue.TIMESTAMP;
    // const senderuid = 'testuid';
    this.curtUserId = this.authService.curtUserId;
    this.chatMessages = this.getMessageHistory(this.groupService.getGroupId());
    // console.log('list mei cuo');
    this.chatMessages.push({
      senderUid: this.curtUserId,
      timestamp: TimeStamp,
      message: msg
    });
  }
}
