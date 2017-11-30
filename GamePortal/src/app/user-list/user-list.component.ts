import {Component, Input, OnInit} from '@angular/core';
import {User} from '../models/user';
import {ChatService} from '../services/chat.service';
import {GroupService} from '../services/group.service';
import {Router} from '@angular/router';
import 'rxjs/add/operator/mergeMap';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';

// TODO: to set up groups!
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
@Input() isChat: boolean;
  // users: Array<any> = [];
  onlineUsers: Array<any> = [];
  offlineUsers: Array<any> = [];
  groups: Array<any> = [];
  public authState: any;
  user: any;

  constructor(private chatService: ChatService,
              private af: AngularFireDatabase,
              private groupService: GroupService,
              private router: Router,
              private afAuth: AngularFireAuth) {
    this.isChat = false;
    // display users and groups!!
    this.user = this.afAuth.authState;
  }

  ngOnInit() {
    console.log('Fetching users...  ');
    let userIdSet: Set<string> = new Set<string>();
    const snapUser = this.chatService.getUsers().valueChanges();
    snapUser.subscribe( users => {
      users.forEach(user => {
        const size = users.length;
        console.log('size too big???', size);
        // let user = {...action.payload.val()};
        const uid = user['userId'];
        console.log('userid???', uid);
        if (!userIdSet.has(uid)) {
          userIdSet.add(uid);
          // get corresponding displayname and isConnected for user:
          this.af.database.ref('users/' + uid + '/publicFields/displayName').once('value').then(result => {
            const dpname = result.val();
            this.af.database.ref('users/' + uid + '/publicFields/isConnected').once('value').then(res => {
              const connected = res.val();
              user = {
                displayName: dpname,
                isConnected: connected
              };
              if (connected) {
                this.onlineUsers.push(user);
              } else {
                this.offlineUsers.push(user);
              }
            });
          });
        }
        return user;
      });
    });

    console.log('Fetching groups...  ');
    const snapGroup = this.groupService.getGroupsForUser().snapshotChanges();
    // TODO: find out why snapshotchanges return a group info multiple times!!!
    let groupIdSet: Set<string> = new Set<string>();
    snapGroup.subscribe(actions => {
      const size = actions.length;
      // console.log('size too big???', size);
      actions.forEach( action => {
        const groupid = action.key;
        // console.log('Group ID: ', groupid);
        if (!groupIdSet.has(groupid)) {
          groupIdSet.add(groupid);
          this.af.database.ref('gamePortal/groups/' + groupid + '/groupName').once('value').then(result => {
            this.groups.push({
              groupId: groupid,
              groupName: result.val()
            });
            // console.log(this.groups[0]);
            // if (this.groups.length === size) {
            //   return groupList;
            // }
          });
        }
        return groupid;
      });
    });
  }

  startChat() {
    this.router.navigate(['/participant-list']);
  }
}
