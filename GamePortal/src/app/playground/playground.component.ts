import { Component, OnInit } from '@angular/core';
import {SpecService} from '../services/spec.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {ActivatedRoute} from '@angular/router';
import {GroupService} from '../services/group.service';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {
  public user: any;
  public groupName: String;
  public groupParticipants: Array<any>;
  constructor(private specService: SpecService,
              private afAuth: AngularFireAuth,
              private af: AngularFireDatabase,
              private groupService: GroupService,
              private route: ActivatedRoute) {
    this.user = this.afAuth.authState;
    this.route.params.subscribe(params => this.groupService.setGroupID(params['groupId']));
  }

  ngOnInit() {
    this.setGroupName();
    this.getParticipants();
  }

  getSpec() {
    return this.specService.getSelectedSpec();
  }

  getMatchRef() {
    return this.specService.getSelectedMatchRef();
  }

  setGroupName() {
    const groupRef = this.groupService.getGroupRef();
    groupRef.child('/groupName').once('value').then(res => {
      this.groupName = res.val();
    });
  }

  getParticipants() {
    const groupRef = this.groupService.getGroupRef();
    const participantsRef = groupRef.child('participants');
    const thiz = this;
    participantsRef.on('value', (snap) => {
      const participants = snap.val(); // dict{uid: participantIdx};
      const len = Object.keys(participants).length;
      const participantsInfo = [];
      Object.keys(participants).forEach((uid) => {
        const userRef = this.af.database.ref(`users/${uid}`);
        const userNameRef = userRef.child('publicFields').child('displayName');
        userNameRef.once('value').then((userName) => {
          const dpName = userName.val();
          const isConnectedRef = userRef.child('publicFields').child('isConnected');
          isConnectedRef.once('value').then( isConnected => {
            const connected = isConnected.val();
            const participant = {
              displayName: dpName,
              isConnected: connected
            };
            participantsInfo.push(participant);
            if (participantsInfo.length === len) {
              this.groupParticipants = participantsInfo;
            }
          });
        });
      });
    });
  }
}
