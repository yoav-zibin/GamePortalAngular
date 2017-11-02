import { Injectable, Provider } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';
import {User} from '../models/user';
import {Group} from '../models/group';

@Injectable()
export class GroupService {
  // public user: Observable<firebase.User>;
  public curtUserId: string;
  public user: any;
  public curtGroupId: string;
  public participants: Array<User>;
  public groupName: string;
  public curtGroup: Group;

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase, private router: Router) {
    this.afAuth.authState.subscribe((auth) => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
        this.curtUserId = auth.uid;
      }
    });
  }

  getGroupsForUser(): any {
    // "groups": {
    //   "$memberOfGroupId": {
    //       "addedByUid": {
    //     },
    //     "timestamp": {
    //     },
    if (!this.user) {
      return [];
    }

    const path = 'users/' + this.curtUserId + '/privateButAddable/groups';
    let groupsInUsers = [];
    this.af.list(path).valueChanges().subscribe(groups => {
      groupsInUsers = groups; // group list in users/userid/...
    });
    console.log(groupsInUsers);
    let groupList = []; // group list in groups/...
    for (let groupInUser of groupsInUsers) {
      const groupid = groupInUser.$memberOfGroupId;
      const groupObj = this.af.object('gamePortal/groups/' + groupid).valueChanges().subscribe( result => {
        groupList.push(result);
      });
    }
    return groupList;
  }

  getGroupId(): any {
    const groupref = firebase.database().ref('gamePortal/groups').push();
    return groupref.key;
  }

  createGroupInfo(): void {
    const groupInfo = {
      'participants': '',
      'groupName': this.groupName,
      'createdOn': firebase.database.ServerValue.TIMESTAMP,
      'messages': '',
    };
    this.af.database.ref('gamePortal/groups/' + this.curtGroupId).update(groupInfo);
  }
  addGroupToDatabase(groupName: string, participants: Array<User>) {
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
    this.curtGroupId = this.getGroupId();
    this.createGroupInfo();
    const timeStamp = firebase.database.ServerValue.TIMESTAMP;
    // for this user:
    let index = 0;
    this.af.database.ref('gamePortal/groups/' + this.curtGroupId + '/participants/' + this.curtUserId).update(
      {
        participantIndex: index
      }
    );
    this.af.database.ref('users/' + this.curtUserId + 'privateButAddable/groups/' + this.curtGroupId).update(
      {
        addedByUid: this.curtUserId,
        timestamp: timeStamp,
      }
    );
    index++;
    // push participants:
    for (const partici of this.participants) {
      const userid = partici.$userId;
      this.af.database.ref('gamePortal/groups/' + this.curtGroupId + '/participants/' + userid).update(
        {
          participantIndex: index
        }
      );
      this.af.database.ref('users/' + userid + 'privateButAddable/groups/' + this.curtGroupId).update(
        {
          addedByUid: this.curtUserId,
          timestamp: timeStamp,
        }
      );
      index++;
    }
  }
}
