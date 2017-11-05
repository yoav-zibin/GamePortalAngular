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
  curtGroupId: any;
  user: any;
  testGroupId = 'ttest';
  public curtUserId: string;
  chatMessages: AngularFireList<ChatMessage>;

  // constructor(private af: AngularFireDatabase,
  //             private afAuth: AngularFireAuth,
  //             private group: GroupService) {
  //   this.afAuth.authState.subscribe((auth) => {
  //     if (auth !== undefined && auth !== null) {
  //       this.user = auth;
  //       this.curtUserId = auth.uid;
  //       console.log('Im in auth, the current auth uid: ', this.curtUserId);
  //     }
  //   });
  // }

  constructor(private authService: AuthService,
              private af: AngularFireDatabase,
              private group: GroupService) {
    this.curtUserId = this.authService.curtUserId;
    console.log('the current auth uid: ', this.curtUserId);
  }

  getUsers() {
    const path = '/gamePortal/recentlyConnected';
    // return this.af.list(path);
    // return this.af.database.ref(path);
    console.log('ready to fetch users');
    return this.af.list(path);
    // ref => {
    //   return ref.orderByChild('/publicFields/isConnected').equalTo(true);
    // }
  }

  getMessageHistory(): AngularFireList<ChatMessage> {
    // for showing feed
    // test group id:
    this.curtGroupId = this.group.curtGroupId;
    return this.af.list('gamePortal/groups/' + this.curtGroupId + '/messages', ref => {
      return ref.limitToLast(20).orderByKey();
    });
  }

  sendMessage(msg: string) {
    // group id? ref?
    //  according to our group chat rules:
    const TimeStamp = firebase.database.ServerValue.TIMESTAMP;
    // const senderuid = 'testuid';
    this.chatMessages = this.getMessageHistory();
    console.log('list mei cuo');
    this.chatMessages.push({
      senderUid: this.curtUserId,
      timestamp: TimeStamp,
      message: msg
    });
  }
}
