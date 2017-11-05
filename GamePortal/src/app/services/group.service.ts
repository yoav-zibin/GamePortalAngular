import { Injectable, Provider } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';
import {Group} from '../models/group';
import {AuthService} from './auth.service';

@Injectable()
export class GroupService {
  // public user: Observable<firebase.User>;
  public curtUserId: string;
  public curtGroupId: string;
  public participants: Array<any>;
  public groupName: string;
  public curtGroup: Group;

  constructor(public authService: AuthService, public af: AngularFireDatabase, private router: Router) {
    this.curtUserId = this.authService.curtUserId; // undefined at first
    // console.log('undefined??no no no', this.curtUserId);
  }

  createGroupInfo(): any {
    this.curtUserId = this.authService.curtUserId;
    console.log('im in create group info, the user id is: ', this.curtUserId);
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
    console.log('the key for this group is: ', groupref.key);
    return groupref.key;
  }

  addGroupToDatabase(groupName: string, participants: Array<any>) {
    this.participants = participants;
    // export class Group {
    //   $groupId?: string;
    //   participants: {
    //     $participantUserId: {
    //       participantIndex: number;
    //     }
    //   };
    //   groupName: string;
    //   createdOn: number;
    //   messages: ChatMessage;
    // }
    this.groupName = groupName;
    this.curtGroupId = this.createGroupInfo();
    const timeStamp = firebase.database.ServerValue.TIMESTAMP;
    // for this user:
    this.af.database.ref('users/' + this.curtUserId + '/privateButAddable/groups/' + this.curtGroupId).update(
      {
        addedByUid: this.curtUserId,
        timestamp: timeStamp,
      }
    );
    let index = 1;
    // push participants:
    for (const partici of this.participants) {
      console.log('participant::::::    ', partici);
      const userid = partici;
      this.af.database.ref('gamePortal/groups/' + this.curtGroupId + '/participants/' + userid).update(
        {
          participantIndex: index
        }
      );
      this.af.database.ref('users/' + userid + '/privateButAddable/groups/' + this.curtGroupId).update(
        {
          addedByUid: this.curtUserId,
          timestamp: timeStamp,
        }
      );
      index++;
    }
  }

  getGroupsForUser(): any {
    // "groups": {
    //   "$memberOfGroupId": {
    //       "addedByUid": {
    //     },
    //     "timestamp": {
    //     },

    console.log('wo jin lai le getGroupsForUser');
    if (!this.curtUserId) {
      return [];
    }

    // test user id:
    const path = 'users/' + this.curtUserId + '/privateButAddable/groups';
    let groupsInUsers = [];
    this.af.list(path).valueChanges().subscribe(groups => {
      groupsInUsers = groups; // group list in users/userid/...
    });
    console.log('groupsInUSERS: ', groupsInUsers);
    const groupList = []; // group list in groups/...
    for (const groupInUser of groupsInUsers) {
      const groupid = groupInUser.$memberOfGroupId;
      const groupObj = this.af.object('gamePortal/groups/' + groupid).valueChanges().subscribe( result => {
        groupList.push(result);
      });
    }
    return groupList;
  }
}

