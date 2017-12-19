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
  // users: Array<any> = [];
  onlineUsers: Array<any> = [];
  offlineUsers: Array<any> = [];
  public authState: any;
  user: any;

  constructor(private chatService: ChatService,
              private af: AngularFireDatabase,
              private groupService: GroupService,
              private router: Router,
              private afAuth: AngularFireAuth) {
    // display users and groups!!
    this.user = this.afAuth.authState;
  }

  ngOnInit() {
    // console.log('Fetching users...  ');
    const userIdSet: Set<string> = new Set<string>();
    const snapUser = this.chatService.getUsers().valueChanges();
    snapUser.subscribe( users => {
      users.forEach(user => {
        const size = users.length;
        // console.log('size too big???', size);
        // let user = {...action.payload.val()};
        const uid = user['userId'];
        // console.log('userid???', uid);
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
  }
}
