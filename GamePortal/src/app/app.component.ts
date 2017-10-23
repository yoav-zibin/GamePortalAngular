import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Game Portal';
  public authState: any;

  constructor(public afAuth: AngularFireAuth, public router: Router) {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  signUporLogin() {
    this.router.navigate(['/login']);
  }

  logOut() {
    this.afAuth.auth.signOut();
  }
}

