import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ChatMessage } from '../models/chat_message';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {
  // should have a group id:
  // when the current user select a group chat
  // open the corresponding chat room
  currentGroupId: any;
  authState: any;

  constructor(private af: AngularFireDatabase,
              private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  set GroupId(groupId: any) {
    this.currentGroupId = groupId;
  }

  getMessageHistory(): AngularFireList<ChatMessage[]> {
    // for showing feed
    return this.af.list('gamePortal/groups/' + this.currentGroupId + '/messages', ref => {
      return ref.limitToLast(20).orderByKey();
    });
  }

  sendMessage(msg: string) {
    // group id? ref?
    //  according to our group chat rules:

  }
}
