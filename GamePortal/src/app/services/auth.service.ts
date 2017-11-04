import { Injectable, Provider } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  // public user: Observable<firebase.User>;
  public authState: any; // actually user
  // current user id
  public curtUserId: string;
  items: AngularFireList<any>;
  errMessage = '';
  msg = '';

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase, private router: Router) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
      if (this.authState) {
        this.curtUserId = auth.uid;
        this.updateOnConnect();
      }
    });
    this.items = af.list('items');
  }

  public createUserInfo(user: any): any {

    const userInfo = {
      'publicFields': {
        'avatarImageUrl': (user.photoURL || 'https://s.ytimg.com/yts/img/avatar_720-vflYJnzBZ.png'),
        'displayName': (user.displayName || user.email || 'new guest'),
        'isConnected': true,
        'lastSeen': firebase.database.ServerValue.TIMESTAMP,
      },
      'privateFields': {
        'email': (user.email || ''),
        'createdOn': firebase.database.ServerValue.TIMESTAMP,
        'phoneNumber': (user.phoneNumber || ''),
        'facebookId': '',
        // 'googleId': user.email,
        'googleId': '',
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
      firebase.database().ref('users/' + result.user.uid + '/privateFields/googleId').set(result.user.email);
      console.log('success');
      this.router.navigate(['/']);
    }).catch(error => {
      console.log(error);
      this.errMessage = error.message;
    });
  }

  logInWithEmail() {
    this.router.navigate(['/emaillogin']);
  }

  logInWithPhone() {
    this.router.navigate(['/phonelogin']);
  }

  logInAnonymous() {
    this.afAuth.auth.signInAnonymously();
    this.router.navigate(['/']);
  }

  logOut() {
    this.afAuth.auth.signOut();
    this.updateOnDisconnect();
  }

  // Updates status when connection to Firebase starts
  public updateOnConnect() {
    return this.af.object('.info/connected').valueChanges().subscribe
    (connected => {
      console.log(this.curtUserId);
      console.log(connected);
      this.af.object('users/' + this.curtUserId + '/publicFields').update({isConnected: connected});
      console.log('woyoucuo');
    });
  }

  // Updates status when connection to Firebase ends
  public updateOnDisconnect() {
    // console.log('calling onDisconnect');
    this.af.object('users/' + this.curtUserId + '/publicFields').update({isConnected: false});
    // const ref = firebase.database().ref(`users/${this.curtUserId}/publicFields/isConnected`);
    // ref.once('value').then(function(snapshot) {
    //   console.log(snapshot.val());
    // });
    // console.log('called...');
  }

  // TODO: refactor to use onDisconnect()
  // public updateStatus() {
  //   const userListRef = firebase.database().ref('users/');
  //   const myUserRef = userListRef.push();
  //   console.log(this.curtUserId);
  //   // Monitor connection state on browser tab
  //   this.af.object('.info/connected').snapshotChanges().subscribe((snap) => {
  //     if (snap) {
  //       // if we lose network then remove this user from the list
  //       myUserRef.onDisconnect().remove();
  //       // set user's online status
  //       this.setUserConnectionStatus(true, myUserRef);
  //     } else {
  //       // client has lost network
  //       this.setUserConnectionStatus(false, myUserRef);
  //     }
  //   });
  // }
  //
  // public setUserConnectionStatus(connected, myUserRef) {
  //   firebase.database().ref('users/' + myUserRef.key + '/publicFields/isConnected').set(connected);
  // }
}
