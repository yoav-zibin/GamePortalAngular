import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: 'auth';
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
  createUserIfNotExists(user) {
    if (this.user) {
      const usersRef = this.af.database.ref('users')
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

  loginWithEmail() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.EmailAuthProvider());
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

