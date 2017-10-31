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

  constructor(chat: ChatService) {
    chat.getUsers().valueChanges().subscribe(users => {
      this.users = users;
    });
  }
  ngOnInit() {
  }

}
