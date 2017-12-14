import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AuthService } from './services/auth.service';
import { EmailLoginComponent } from './email-login/email-login.component';
import { PhoneLoginComponent } from './phone-login/phone-login.component';
import { AppRoutingModule } from './app-routing.module';
import { WindowService } from './window.service';
import { LoginIndexComponent } from './login-index/login-index.component';
import { ChatFormComponent } from './chat-form/chat-form.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatFeedComponent } from './chat-feed/chat-feed.component';
import { MessageComponent } from './message/message.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserItemComponent } from './user-item/user-item.component';
import { ChatService } from './services/chat.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GroupService } from './services/group.service';
import { GroupItemComponent } from './group-item/group-item.component';
import { ParticipantListComponent } from './participant-list/participant-list.component';
import { MatListModule,
         MatButtonModule,
         MatButtonToggleModule,
         MatTabsModule,
         MatFormFieldModule,
         MatCardModule,
         MatInputModule,
         MatIconModule,
         MatGridListModule
} from '@angular/material';
import { MatSelectModule } from '@angular/material/select'
import { SpecLoaderComponent} from './spec-loader/spec-loader.component';
import { PlaygroundComponent } from './playground/playground.component';
import { GroupWrapperComponent } from './group-wrapper/group-wrapper.component';
import { GameComponent } from './game/game.component';
import { GameSelectorComponent } from './game-selector/game-selector.component';
import { SpecService } from './services/spec.service';
import { PieceComponent } from './piece/piece.component';
import { BoardComponent } from './board/board.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupsCenterComponent } from './groups-center/groups-center.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M',
  authDomain: 'universalgamemaker.firebaseapp.com',
  databaseURL: 'https://universalgamemaker.firebaseio.com',
  projectId: 'universalgamemaker',
  storageBucket: 'universalgamemaker.appspot.com',
  messagingSenderId: '144595629077'

  // // config for test firebase:
  // apiKey: 'AIzaSyBrfL2oO_3MCC-A9ympGKJGnZl2SERK7kA',
  // authDomain: 'gameportalangular.firebaseapp.com',
  // databaseURL: 'https://gameportalangular.firebaseio.com',
  // projectId: 'gameportalangular',
  // storageBucket: 'gameportalangular.appspot.com',
  // messagingSenderId: '678129730438'
};

@NgModule({
  declarations: [
    AppComponent,
    EmailLoginComponent,
    PhoneLoginComponent,
    LoginIndexComponent,
    ChatFormComponent,
    ChatRoomComponent,
    ChatFeedComponent,
    MessageComponent,
    NavbarComponent,
    UserListComponent,
    UserItemComponent,
    GroupItemComponent,
    ParticipantListComponent,
    SpecLoaderComponent,
    PlaygroundComponent,
    GroupWrapperComponent,
    GameComponent,
    GameSelectorComponent,
    PieceComponent,
    BoardComponent,
    GroupListComponent,
    GroupsCenterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // NoopAnimationsModule,
    MatListModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule
  ],
  providers: [GroupService, AuthService, WindowService, ChatService, SpecService],
  bootstrap: [AppComponent]
})

export class AppModule { }
