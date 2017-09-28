import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AuthService} from './auth.service';
import { EmailLoginComponent } from './email-login/email-login.component';
import {AppRoutingModule} from './app-routing.module';

export const firebaseConfig = {
  apiKey: 'AIzaSyBrfL2oO_3MCC-A9ympGKJGnZl2SERK7kA',
  authDomain: 'gameportalangular.firebaseapp.com',
  databaseURL: 'https://gameportalangular.firebaseio.com',
  projectId: 'gameportalangular',
  storageBucket: 'gameportalangular.appspot.com',
  messagingSenderId: '678129730438'
};

@NgModule({
  declarations: [
    AppComponent,
    EmailLoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
