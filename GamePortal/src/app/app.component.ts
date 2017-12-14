import {Component, DoCheck, OnInit} from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import {Router} from '@angular/router';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Game Portal';
  public user: any;

  constructor(public afAuth: AngularFireAuth, public router: Router, public authService: AuthService) {
    this.user = this.afAuth.authState;
  }
}

