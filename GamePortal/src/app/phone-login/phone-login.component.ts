import { Component, OnInit } from '@angular/core';
import { WindowService} from '../window.service';
import * as firebase from 'firebase';
import {PhoneNumber} from './phone-number';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.css']
})

export class PhoneLoginComponent implements OnInit {

  windowRef: any;
  phoneNumber = new PhoneNumber();
  verificationCode: string;
  public authState: any;

  constructor(private win: WindowService,
              public afAuth: AngularFireAuth,
              public af: AngularFireDatabase,
              private router: Router,
              public authservice: AuthService) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
  }

  sendLoginCode() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;
    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
      })
      .catch( error => console.log(error) );
  }
  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then( result => {
        this.authState = result;
        const userInfo = this.authservice.createUserInfo(result.user);
        // this.af.database.ref('users/' + result.user.uid).update(userInfo);
        firebase.database().ref('users/' + result.user.uid).update(userInfo);
        this.router.navigate(['/']);
        console.log('success');
      })
      .catch( error => console.log(error, 'Incorrect code entered?'));
  }
}
