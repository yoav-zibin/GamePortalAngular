import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/*import {PhoneLoginComponent} from './phone-login/phone-login.component';*/
import {EmailLoginComponent} from './email-login/email-login.component';


const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  /*{ path: 'phonelogin',  component: PhoneLoginComponent },*/
  { path: 'emaillogin',  component: EmailLoginComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
