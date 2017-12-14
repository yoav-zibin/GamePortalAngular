import { Component, OnInit } from '@angular/core';
import {SpecService} from '../services/spec.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {ActivatedRoute} from '@angular/router';
import {GroupService} from '../services/group.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {
  public user: any;
  constructor(private specService: SpecService,
              private afAuth: AngularFireAuth,
              private groupService: GroupService,
              private route: ActivatedRoute) {
    this.user = this.afAuth.authState;
    this.route.params.subscribe(params => this.groupService.setGroupID(params['groupId']));
  }

  ngOnInit() {
  }

  getSpec() {
    return this.specService.getSelectedSpec();
  }

  getMatchRef() {
    return this.specService.getSelectedMatchRef();
  }
}
