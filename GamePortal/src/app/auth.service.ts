import {Injectable, Provider} from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  items: FirebaseListObservable<any[]>;
  msg = '';

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase) {
    this.items = af.list('/messages', {
      query: {
        limitToLast: 50
      }
    });
    this.user = this.afAuth.authState;
  }

  createUserIfNotExists(user: any) {
    if (this.user) {
      const usersRef = firebase.database().ref('users');
      const userData = {
        'privateFields': {

        },
        'publicFields': {
          'avatarImageUrl': user.photoURL || '',
          'displayName': user.displayName || user.email,
          'email': user.email
        }
      };

      usersRef.child(user.uid).transaction(function(currentUserData) {
        if (currentUserData === null || !currentUserData.email) {
          return userData;
        }
      });
    }
  }

  loginWithGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(function(result) {
      console.log(result);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
      this.createUserIfNotExists(user);
    }).catch(function(error) {
      console.error(error);
    });
  }
  signupWithEmail(email: string, password: string) {
    this.afAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  loginWithEmail(email: string, password: string) {
    this.afAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  loginWithPhone() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.PhoneAuthProvider());
  }

  loginAnonymous() {
    this.afAuth.auth.signInAnonymously();
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  Send(desc: string) {
    this.items.push({ message: desc});
    this.msg = '';
  }
}
