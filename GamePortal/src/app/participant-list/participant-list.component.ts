import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {GroupService} from '../services/group.service';
import {ChatService} from '../services/chat.service';
import {MatListModule} from '@angular/material';
import {AngularFireDatabase} from 'angularfire2/database';
import {AuthService} from '../services/auth.service';
// import {SelectModule} from 'ng-select';
@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css']
})
export class ParticipantListComponent implements OnInit {
  users: Array<any> = [];
  groupName: string;
  // usernameList: Array<string>;
  selectedUsers: any;

  constructor(private chatService: ChatService,
              private af: AngularFireDatabase,
              private groupService: GroupService,
              private router: Router,
              private authService: AuthService) {
    // display users and groups!!
    const snap = this.chatService.getUsers().valueChanges();
    snap.subscribe( users => {
      // const $key = action.key;
      // const user = { userId: $key, ...action.payload.val() };
      // console.log(user);
      // return user;
      users.forEach(user => {
        // let user = {...action.payload.val()};
        const uid = user['userId'];
        // get corresponding displayname and isConnected for user:
        this.af.database.ref('users/' + uid + '/publicFields/displayName').once('value').then(result => {
          const dpname = result.val();
          this.af.database.ref('users/' + uid + '/publicFields/isConnected').once('value').then(res => {
            const connected = res.val();
            // can not select current user as participant again.
            if (connected === true && uid !== this.authService.curtUserId) {
              user = {
                userId: uid,
                displayName: dpname
              };
              this.users.push(user);
            }
          });
        });
        return user;
      });
      // console.log('map ends');
      // this.users = mylist;
      // console.log(this.users);
    });
    // this.users = [1, 2, 3, 4, 45, 5, 66, 6];
  }

  ngOnInit() {
  }

  submit() {
    console.log(this.selectedUsers[0]);
    this.groupService.addGroupToDatabase(this.groupName, this.selectedUsers);
    this.router.navigate(['/chat']);
  }
}
