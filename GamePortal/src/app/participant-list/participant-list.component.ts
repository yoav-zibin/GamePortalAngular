///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {GroupService} from '../services/group.service';
import {ChatService} from '../services/chat.service';
import {MatListModule} from '@angular/material';
// import {SelectModule} from 'ng-select';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css']
})
export class ParticipantListComponent implements OnInit {
  users: Array<any> = [];
  // usernameList: Array<string>;
  selectedUsers: any;
  constructor(chatService: ChatService, groupService: GroupService, private router: Router) {
    // display users and groups!!
    const snap = chatService.getUsers().snapshotChanges();
    snap.subscribe( actions => {
      // const $key = action.key;
      // const user = { userId: $key, ...action.payload.val() };
      // console.log(user);
      // return user;
      // let mylist = [];
      actions.forEach(action => {
        console.log(action.key);
        console.log(action.payload.val());
        const $key = action.key;
        const user = { userId: $key, ...action.payload.val() };
        console.log(user);
        // mylist.push(user);
        this.users.push(user);
        console.log('ni ma si le');
        // console.log(mylist);
        return user;
      });
      // console.log('map ends');
      // this.users = mylist;
      console.log(this.users);
    });
    // this.users = [1, 2, 3, 4, 45, 5, 66, 6];
  }

  ngOnInit() {
  }

  submit() {
    console.log(this.selectedUsers[0]);
    this.router.navigate(['/chat']);
  }
}
