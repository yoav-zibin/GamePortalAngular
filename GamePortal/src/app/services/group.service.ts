import { Injectable, Provider } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';
import {Group} from '../models/group';
import {AuthService} from './auth.service';
import { Observable } from 'rxjs/';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GroupService {
  // public user: Observable<firebase.User>;
  public curtUserId: string;
  public curtGroupId: string = null;
  public participants: Array<any>;
  public groupName: string;
  public isCreateNewGroup: boolean = false;

  constructor(public authService: AuthService, public af: AngularFireDatabase, private router: Router) {
    this.curtUserId = this.authService.curtUserId; // undefined at first
  }

  getGroupId() {
    // console.log('kai shi shi blank? ', this.curtGroupId.asObservable());
    // TODO: have to click twice two trigger feed, since on init, this returns an (empty) observable.
    // TODO: so, it could still pass the ngif.
    return this.curtGroupId;
  }

  setGroupID(gid) {
    // console.log('setting group id: ', gid);
    this.curtGroupId = (gid);
  }

  getIsCreateNewGroup() {
    return this.isCreateNewGroup;
  }

  setIsCreateNewGroup(b: boolean) {
    this.isCreateNewGroup = b;
  }

  createGroupInfo(): any {
    // we make sure we have authService.curtUserId
    this.curtUserId = this.authService.curtUserId;
    // console.log('im in create group info, the user id is: ', this.curtUserId);
    let owner = {};
    owner[this.curtUserId] = {participantIndex: 0};
    const groupInfo = {
      participants: owner,
      groupName: this.groupName,
      createdOn: firebase.database.ServerValue.TIMESTAMP,
      messages: null,
      matches: null
    };
    const groupref = firebase.database().ref('gamePortal/groups').push(groupInfo);
    // console.log('the key for this group is: ', groupref.key);
    return groupref.key;
  }

  addGroupToDatabase(groupName: string, participants: Array<any>) {
    this.participants = participants;
    this.groupName = groupName;
    // console.log('creating group info: ');
    const groupid = this.createGroupInfo();
    this.setGroupID(groupid);
    const timeStamp = firebase.database.ServerValue.TIMESTAMP;
    // for this user:
    this.af.database.ref('users/' + this.curtUserId + '/privateButAddable/groups/' + groupid).update(
      {
        addedByUid: this.curtUserId,
        timestamp: timeStamp,
      }
    );
    let index = 1;
    // push participants:
    for (const partici of this.participants) {
      // console.log('participant::::::    ', partici);
      const userid = partici;
      this.af.database.ref('gamePortal/groups/' + groupid + '/participants/' + userid).update(
        {
          participantIndex: index
        }
      );
      this.af.database.ref('users/' + userid + '/privateButAddable/groups/' + groupid).update(
        {
          addedByUid: this.curtUserId,
          timestamp: timeStamp,
        }
      );
      index++;
    }
  }

  getGroupsForUser(): any {
    // console.log('wo jin lai le getGroupsForUser');
    this.curtUserId = this.authService.curtUserId;
    if (!this.curtUserId) {
      return [];
    }
    const path = 'users/' + this.curtUserId + '/privateButAddable/groups';
    // console.log('wo zai kan group lujing: ', path);
    return this.af.list(path);
  }

  getGroupRef() {
    return this.af.database.ref(`gamePortal/groups/${this.curtGroupId}`);
  }

  // getGroupName() {
  //   const groupRef = this.getGroupRef();
  //   groupRef.child('/groupName').once('value').then(res => {
  //     return res.val();
  //   });
  // }

  getParticipants() {
    const groupRef = this.getGroupRef();
    const participantsRef = groupRef.child('participants');
    const thiz = this;
    participantsRef.on('value', (snap) => {
      const participants = snap.val(); // dict{uid: participantIdx};
      const len = participants.length;
      const participantsInfo = [];
      Object.keys(participants).forEach((uid) => {
        const userRef = this.af.database.ref(`users/${uid}`);
        const userNameRef = userRef.child('publicFields').child('displayName');
        userNameRef.once('value').then((userName) => {
          const dpName = userName.val();
          const isConnectedRef = userRef.child('publicFields').child('isConnected');
          isConnectedRef.once('value').then( isConnected => {
            const connected = isConnected.val();
            const participant = {
              displayName: dpName,
              isConnected: connected
            };
            participantsInfo.push(participant);
            if (participantsInfo.length === len) {
              return participantsInfo;
            }
          });
        });
      });
    });
  }
}

