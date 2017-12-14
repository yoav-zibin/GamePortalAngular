import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EmailLoginComponent} from './email-login/email-login.component';
import {PhoneLoginComponent} from './phone-login/phone-login.component';
import {LoginIndexComponent} from './login-index/login-index.component';
import {ChatRoomComponent} from './chat-room/chat-room.component';
import {UserListComponent} from './user-list/user-list.component';
import {ParticipantListComponent} from './participant-list/participant-list.component';
import {GameComponent} from './game/game.component';
import {PlaygroundComponent} from "./playground/playground.component";
import {GroupsCenterComponent} from "./groups-center/groups-center.component";

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'login',  component: LoginIndexComponent},
  { path: 'emaillogin',  component: EmailLoginComponent},
  { path: 'phonelogin',  component: PhoneLoginComponent },
  { path: 'chat',  component: ChatRoomComponent },
  { path: 'users',  component: UserListComponent },
  {path: 'participant-list',  component: ParticipantListComponent},
  {path: 'game',  component: GameComponent},
  {path: 'play/:groupId', component: PlaygroundComponent},
  {path: 'center', component: GroupsCenterComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
