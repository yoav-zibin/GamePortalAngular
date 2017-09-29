import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.css']
})
export class EmailLoginComponent implements OnInit {
  public user: Observable<firebase.User>;
  email: string;
  password: string;
  errMessage = '';
  errEmail  = '';
  errPassWord = '';

  constructor(public afAuth: AngularFireAuth, private router: Router) {
    this.user = this.afAuth.authState;
  }
  ngOnInit() {
  }
  signUp() {
    /*this.checkIfValid();*/
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then((user) => {
        this.user = user;
        this.email = user.email;
        this.password = user.password;
        firebase.database().ref('users/' + user.uid + '/privateFileds').set({
          email: this.email,
          password: this.password
        });
        this.router.navigate(['/']);
        console.log('success');
      })
      .catch(error => {
        console.log(error);
        this.errMessage = error.message;
      });
  }
  /*checkIfValid() {
    if (this.email.length === 0 || !this.email.includes('@')) {
      this.errEmail = 'Please enter a valid Email!';
      return false;
    }
    if (this.password.length < 6) {
      this.errPassWord = 'PassWord length must be exceeding 6!';
    }
  }*/
  signIn() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then((user) => {
        this.user = user;
      })
      .catch(error => {
        console.log(error);
        this.errMessage = error.message;
      });
  }

  signOut() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }
}
