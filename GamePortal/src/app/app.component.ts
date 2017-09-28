import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: 'app';
  email: string;
  password: string;

  constructor(public afAuth: AngularFireAuth, public router: Router) {}

  signUpWithEmail() {
    this.router.navigate(['emaillogin']);
  }

  logInWithEmail() {
    this.router.navigate(['emaillogin']);
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}

