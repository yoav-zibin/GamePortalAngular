import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {GroupService} from '../services/group.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked {
  @ViewChild('scroller') private feedContainer: ElementRef;
  public user: any;
  public groupId: any;
  constructor(private afAuth: AngularFireAuth, private groupService: GroupService) {
    this.user = this.afAuth.authState;
    this.groupId = this.groupService.getObservable();
    this.groupId.subscribe(res => {
      console.log('ssdfasasd:', res);
    });
  }

  scrollToBottom(): void {
    this.feedContainer.nativeElement.scrollTop
      = this.feedContainer.nativeElement.scrollHeight;
  }
  ngOnInit() {
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
}
