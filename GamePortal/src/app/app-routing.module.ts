import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EmailLoginComponent} from './email-login/email-login.component';
import {PhoneLoginComponent} from './phone-login/phone-login.component';
import {LoginIndexComponent} from './login-index/login-index.component';
import {ChatRoomComponent} from './chat-room/chat-room.component';
import {UserListComponent} from './user-list/user-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
  { path: 'login',  component: LoginIndexComponent},
  { path: 'emaillogin',  component: EmailLoginComponent},
  { path: 'phonelogin',  component: PhoneLoginComponent },
  { path: 'chat',  component: ChatRoomComponent },
  { path: 'users',  component: UserListComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
