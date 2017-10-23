import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AuthService} from './auth.service';
import {EmailLoginComponent } from './email-login/email-login.component';
import { PhoneLoginComponent } from './phone-login/phone-login.component';
import {AppRoutingModule} from './app-routing.module';
import {WindowService} from './window.service';
import { LoginIndexComponent } from './login-index/login-index.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M',
  authDomain: 'universalgamemaker.firebaseapp.com',
  databaseURL: 'https://universalgamemaker.firebaseio.com',
  projectId: 'universalgamemaker',
  storageBucket: 'universalgamemaker.appspot.com',
  messagingSenderId: '144595629077'
};

@NgModule({
  declarations: [
    AppComponent,
    EmailLoginComponent,
    PhoneLoginComponent,
    LoginIndexComponent
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
  providers: [AuthService, WindowService],
  bootstrap: [AppComponent]
})

export class AppModule { }
