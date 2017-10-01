import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.css']
})
export class EmailLoginComponent implements OnInit {
  user: Observable<firebase.User>;
  email: string;
  password: string;
  errMessage = '';

  constructor(public afAuth: AngularFireAuth,
              public af: AngularFireDatabase,
              private router: Router) {
    this.user = this.afAuth.authState;
  }
  ngOnInit() {
  }
  signUp() {
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then((result) => {
/*        this.email = result.user.email;
        this.password = result.user.password;*/
        this.af.database.ref('users/' + result.uid + '/privateFileds').set({
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
  signIn() {
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then((result) => {
      })
      .catch(error => {
        console.log(error);
        this.errMessage = error.message;
      });
  }
}
