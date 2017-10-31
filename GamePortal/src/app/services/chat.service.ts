import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ChatMessage } from '../models/chat_message';
import { Observable } from 'rxjs/Observable';
import {User} from '../models/user';

// TODO: groupid, participants, index;
@Injectable()
export class ChatService {
  // should have a group id:
  // when the current user select a group chat
  // open the corresponding chat room
  currentGroupId: any;
  user: any;
  testGroupId = 'ttest';
  public curtUserId: string;
  chatMessages: AngularFireList<ChatMessage>;

  constructor(private af: AngularFireDatabase,
              private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((auth) => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
        this.curtUserId = auth.uid;
      }
    });
  }

  set GroupId(groupId: any) {
    this.currentGroupId = groupId;
  }

  getUsers() {
    const path = '/users';
    return this.af.list(path, ref => {
      return ref.orderByChild('isConnected').equalTo(true);
    });
  }

  getMessageHistory(): AngularFireList<ChatMessage> {
    // for showing feed
    // test group id:
    return this.af.list('gamePortal/groups/' + this.testGroupId + '/messages', ref => {
      return ref.limitToLast(20).orderByKey();
    });
  }

  sendMessage(msg: string) {
    // group id? ref?
    //  according to our group chat rules:
    const TimeStamp = firebase.database.ServerValue.TIMESTAMP;
    const senderuid = 'testuid';
    this.chatMessages = this.getMessageHistory();
    console.log('list mei cuo');
    this.chatMessages.push({
      senderUid: senderuid,
      timestamp: TimeStamp,
      message: msg
    });
  }
}
