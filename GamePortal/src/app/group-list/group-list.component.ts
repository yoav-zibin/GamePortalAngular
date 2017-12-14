import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import {GroupService} from "../services/group.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "angularfire2/auth";

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {

  groups: Array<any> = [];
  // public authState: any;
  user: any;

  constructor(private af: AngularFireDatabase,
              private groupService: GroupService,
              private router: Router,
              private afAuth: AngularFireAuth) {
    this.user = this.afAuth.authState;
  }

  ngOnInit() {
    console.log('Fetching groups...  ');
    const snapGroup = this.groupService.getGroupsForUser().snapshotChanges();
    // TODO: find out why snapshotchanges return a group info multiple times!!!
    const groupIdSet: Set<string> = new Set<string>();
    snapGroup.subscribe(actions => {
      const size = actions.length;
      // console.log('size too big???', size);
      actions.forEach( action => {
        const groupid = action.key;
        // console.log('Group ID: ', groupid);
        if (!groupIdSet.has(groupid)) {
          groupIdSet.add(groupid);
          this.af.database.ref('gamePortal/groups/' + groupid + '/groupName').once('value').then(result => {
            this.groups.push({
              groupId: groupid,
              groupName: result.val()
            });
            // console.log(this.groups[0]);
            // if (this.groups.length === size) {
            //   return groupList;
            // }
          });
        }
        return groupid;
      });
    });
  }

}
