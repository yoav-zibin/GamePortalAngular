import { Component, OnInit } from '@angular/core';
import {SpecService} from '../services/spec.service';
import {AngularFireAuth} from 'angularfire2/auth';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {
  public user: any;
  constructor(private specService: SpecService, private afAuth: AngularFireAuth) {
    this.user = this.afAuth.authState;
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
