import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AngularFireAuth} from 'angularfire2/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: any;
  userName: string;
  constructor(private afAuth: AngularFireAuth, private authService: AuthService) { }

  ngOnInit() {
    this.user = this.afAuth.authState;
    console.log('auth test: ', this.user);
      // TODO: might not have a displayname
    this.user.subscribe(user => {
      if (user) {
        this.userName = user.displayName || user.email || 'new guest';
      }
    });
  }

  logout() {
    this.authService.logOut();
  }

}
