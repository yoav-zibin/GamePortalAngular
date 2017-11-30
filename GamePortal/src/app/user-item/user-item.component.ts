import {Component, Input, OnInit} from '@angular/core';
import {User} from '../models/user';
import {ChatService} from '../services/chat.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css']
})
export class UserItemComponent implements OnInit {

  @Input() user: any;
  displayName: string;
  constructor(chat: ChatService) {
  }

  ngOnInit() {
    if (this.user.displayName) {
      this.displayName = this.user.displayName;
    } else {
      this.displayName = 'Anonymous user';
    }
  }
}
