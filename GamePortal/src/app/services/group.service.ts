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
    // console.log('undefined??no no no', this.curtUserId);
    // this.curtGroupId.subscribe(res => {
    //   console.log('you ma?', res);
    // });
  }

  getGroupId() {
    // console.log('kai shi shi blank? ', this.curtGroupId.asObservable());
    // TODO: have to click twice two trigger feed, since on init, this returns an (empty) observable.
    // TODO: so, it could still pass the ngif.
    return this.curtGroupId;
  }

  // getMessageHistory(): any {
  //   // for showing feed
  //   // test group id:
  //   console.log('get message history for: ', this.getGroupId());
  //   return this.af.list('gamePortal/groups/' + this.getGroupId() + '/messages', ref => {
  //     return ref.limitToLast(20).orderByKey();
  //   });
  //   // if (!this.curtGroupId) {
  //   //   return null;
  //   // }
  // }

  setGroupID(gid) {
    console.log('setting group id: ', gid);
    this.curtGroupId = (gid);
  }

  getIsCreateNewGroup() {
    return this.isCreateNewGroup;
  }

  setIsCreateNewGroup(b: boolean) {
    this.isCreateNewGroup = b;
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
    this.groupName = groupName;
    console.log('creating group info: ');
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
      console.log('participant::::::    ', partici);
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
    console.log('wo jin lai le getGroupsForUser');
    this.curtUserId = this.authService.curtUserId;
    if (!this.curtUserId) {
      return [];
    }

    // test user id:
    const path = 'users/' + this.curtUserId + '/privateButAddable/groups';
    console.log('wo zai kan group lujing: ', path);
    return this.af.list(path);

    //
    // this.af.list(path).valueChanges().subscribe(groups => {
    //   groupsInUsers = groups; // group list in users/userid/...
    //   console.log('groupsInUSERS: ', groupsInUsers);
    //   const groupList = []; // group list in groups/...
    //   for (const groupInUser of groupsInUsers) {
    //     const groupid = groupInUser.$memberOfGroupId;
    //     const groupObj = this.af.object('gamePortal/groups/' + groupid).valueChanges().subscribe( result => {
    //       groupList.push(result);
    //     });
    //   }
    //   return groupList;
    // });
  }
}

