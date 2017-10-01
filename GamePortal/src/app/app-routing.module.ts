import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EmailLoginComponent} from './email-login/email-login.component';
import {PhoneLoginComponent} from './phone-login/phone-login.component';
import {LoginIndexComponent} from './login-index/login-index.component';


const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'login',  component: LoginIndexComponent},
  { path: 'emaillogin',  component: EmailLoginComponent},
  { path: 'phonelogin',  component: PhoneLoginComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
