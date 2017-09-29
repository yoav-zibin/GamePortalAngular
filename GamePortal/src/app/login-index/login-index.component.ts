import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-index',
  templateUrl: './login-index.component.html',
  styleUrls: ['./login-index.component.css']
})
export class LoginIndexComponent implements OnInit {

  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth, public router: Router, public authservice: AuthService) {
    this.user = this.afAuth.authState;
  }
  ngOnInit() {
  }

  signUpWithEmail() {
    this.authservice.signUpWithEmail();
  }

  logInWithGoogle() {
    this.authservice.logInWithGoogle();
  }

  logInWithPhone() {
    // this.afAuth.auth.signInWithPopup(new firebase.auth.PhoneAuthProvider());
    this.authservice.logInWithPhone();
  }

  logInWithEmail() {
    this.authservice.logInWithEmail();
  }

  logInAnonymous() {
    this.authservice.logInAnonymous();
  }
}
