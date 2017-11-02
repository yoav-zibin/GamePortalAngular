import { Component, OnInit } from '@angular/core';
import {User} from '../models/user';
import {ChatService} from '../services/chat.service';

// TODO: to set up groups!
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: any;
  groups: any;

  constructor(chatService: ChatService, groupService: GroupService) {
    // display users and groups!!
    chatService.getUsers().valueChanges().subscribe(users => {
      this.users = users;
    });
    this.groups = groupService.getGroupsForUser();

  }

  ngOnInit() {

  }

}
