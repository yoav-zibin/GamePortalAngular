import { Injectable, Provider } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  public user: Observable<firebase.User>;
  items: AngularFireList<any>;
  errMessage = '';
  msg = '';

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase, private router: Router) {
    this.user = this.afAuth.authState;
    this.items = af.list('items');
  }

  logInWithGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function(result) {
      firebase.database().ref('users/' + this.user.uid + '/publicFileds').set({
        avatarImageUrl: this.user.photoURL,
        displayName: this.user.displayName,
        email: this.user.email
      });
      console.log('success');
    })
      .catch(error => {
        console.log(error);
        this.errMessage = error.message;
      });
  }

  signUpWithEmail() {
    this.router.navigate(['/emaillogin']);
  }

  logInWithEmail() {
    this.router.navigate(['/emaillogin']);
  }

  logInWithPhone() {
    this.router.navigate(['/phonelogin']);
  }

  logInAnonymous() {
    this.afAuth.auth.signInAnonymously();
  }

  Send(desc: string) {
    this.items.push({ message: desc});
    this.msg = '';
  }
}
