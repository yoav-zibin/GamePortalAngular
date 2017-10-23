import { Injectable, Provider } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  // public user: Observable<firebase.User>;
  public authState: any; // actually user
  items: AngularFireList<any>;
  errMessage = '';
  msg = '';

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase, private router: Router) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
    this.items = af.list('items');
  }

  public createUserInfo(user: any): any {

    const userInfo = {
      'publicFields': {
        'avatarImageUrl': (user.photoURL || ''),
        'displayName':  (user.displayName || ''),
        'isConnected':  true,
        'lastSeen':  firebase.database.ServerValue.TIMESTAMP,
      },
      'privateFields' : {
        'email':  (user.email || ''),
        'createdOn':  firebase.database.ServerValue.TIMESTAMP,
        'phoneNumber': '',
        'facebookId': '',
        'googleId': user.email,
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
      this.authState = result.user;
      const userInfo = this.createUserInfo(result.user);
      // note using firebase.database instead of this.af.database!!!
      firebase.database().ref('users/' + result.user.uid).update(userInfo);
      this.router.navigate(['/']);
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
