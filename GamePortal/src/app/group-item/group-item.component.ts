import { Component, Input, OnInit } from '@angular/core';
import {GroupService} from '../services/group.service';
import {ChatService} from '../services/chat.service';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.css']
})
export class GroupItemComponent implements OnInit {
  @Input() group: any;
  constructor(private groupService: GroupService,
               private chatService: ChatService) { }

  ngOnInit() {
  }

  setCurtGroupId() {
    console.log('setting groupid:...');
    // set observable groupid in groupservice:
    this.groupService.setGroupID(this.group.groupId);
  }
}
