import { Component, Input, OnInit } from '@angular/core';
import {GroupService} from '../services/group.service';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.css']
})
export class GroupItemComponent implements OnInit {
  @Input() group: any;
  constructor(groupService: GroupService) { }

  ngOnInit() {
  }

}
