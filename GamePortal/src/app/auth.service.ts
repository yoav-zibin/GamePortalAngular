import { Injectable, Provider } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  // public user: Observable<firebase.User>;
  public authState: any;
  items: AngularFireList<any>;
  errMessage = '';
  msg = '';

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase, private router: Router) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
    this.items = af.list('items');
  }

  createUserInfo(result: any): any {

    const userInfo = {
      'publicFields': {
        'avatarImageUrl': (result.user.photoURL || ''),
        'displayName':  (result.user.displayName || ''),
        'isConnected':  true,
        'lastSeen':  firebase.database.ServerValue.TIMESTAMP,
      },
      'privateFields' : {
        'email':  (result.user.email || ''),
        'createdOn':  firebase.database.ServerValue.TIMESTAMP,
        'phoneNumber': '',
        'facebookId': '',
        'googleId': result.user.email,
        'twitterId': '',
        'githubId': '',
        'friends': '',
        'pushNotificationsToken': '',
      }
    };
    return userInfo;
  }

  logInWithGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(result => {
      this.authState = result;
      const userInfo = this.createUserInfo(result);
      firebase.database().ref('users/' + result.user.uid).update(userInfo);
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

  // Send(desc: string) {
  //   this.items.push({ message: desc});
  //   this.msg = '';
  // }
}
