import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {GroupService} from '../services/group.service';
import {AngularFireAuth} from "angularfire2/auth";

@Component({
  selector: 'app-groups-center',
  templateUrl: './groups-center.component.html',
  styleUrls: ['./groups-center.component.css']
})
export class GroupsCenterComponent implements OnInit {
  user: any;
  constructor(private afAuth: AngularFireAuth, private router: Router, private groupService: GroupService) {
    this.user = this.afAuth.authState;
  }

  ngOnInit() {
    this.groupService.setIsCreateNewGroup(false);
  }

  createGroup() {
    this.groupService.setIsCreateNewGroup(true);
  }

  getIsCreateNewGroup() {
    return this.groupService.getIsCreateNewGroup();
  }
}
