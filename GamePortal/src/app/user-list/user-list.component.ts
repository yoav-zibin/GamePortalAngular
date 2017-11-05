import {Component, Input, OnInit} from '@angular/core';
import {User} from '../models/user';
import {ChatService} from '../services/chat.service';
import {GroupService} from '../services/group.service';
import {Router} from '@angular/router';
import 'rxjs/add/operator/mergeMap';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from "angularfire2/auth";

// TODO: to set up groups!
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
@Input() isChat: boolean;
  users: Array<any> = [];
  groups: any;
  public authState: any;
  user: any;

  constructor(public chatService: ChatService, private afAuth: AngularFireAuth, public af: AngularFireDatabase, public groupService: GroupService, private router: Router) {
    this.isChat = false;
    // display users and groups!!
    this.user = this.afAuth.authState;

    const snap = this.chatService.getUsers().snapshotChanges();
    snap.subscribe( actions => {
      // const $key = action.key;
      // const user = { userId: $key, ...action.payload.val() };
      // console.log(user);
      // return user;
      actions.forEach(action => {
        // recentlyconnected ID:
        // console.log(action.key);
        // userid and timestamp:
        // console.log(action.payload.val());
        let user = {...action.payload.val()};
        // console.log(user);
        const uid = user.userId;
        // get corresponding displayname and isConnected for user:
        this.af.database.ref('users/' + uid + '/publicFields/displayName').once('value').then(result => {
          const dpname = result.val();
          this.af.database.ref('users/' + uid + '/publicFields/isConnected').once('value').then(res => {
            const connected = res.val();
            user = {
              displayName: dpname,
              isConnected: connected
            };
            this.users.push(user);
          });
        });
        return user;
      });
      // console.log('map ends');
      // this.users = mylist;
      // console.log(this.users);
    });
    this.groups = this.groupService.getGroupsForUser();
  }

  ngOnInit() {

  }

  startChat() {
    console.log('wo jin lai le');
    this.router.navigate(['/participant-list']);
  }
}
