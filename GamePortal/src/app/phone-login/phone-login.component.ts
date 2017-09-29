import { Component, OnInit } from '@angular/core';
import { WindowService} from '../window.service';
import * as firebase from 'firebase';
import {PhoneNumber} from './phone-number';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.css']
})

export class PhoneLoginComponent implements OnInit {

  windowRef: any;
  phoneNumber = new PhoneNumber();
  verificationCode: string;
  user: any;

  constructor(private win: WindowService,
              public afAuth: AngularFireAuth,
              public af: AngularFireDatabase) { }

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
        this.user = result.user;
        this.af.database.ref('users/' + result.user.uid + '/privateFields').set({
          phone_number: this.phoneNumber.e164
        });
      })
      .catch( error => console.log(error, 'Incorrect code entered?'));
  }

}
