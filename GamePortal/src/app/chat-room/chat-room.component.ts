import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {GroupService} from '../services/group.service';
import {AngularFireDatabase} from 'angularfire2/database';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked {
  @ViewChild('scroller') private feedContainer: ElementRef;
  public user: any;
  participants: any;
  groupName: any;
  constructor(private afAuth: AngularFireAuth, private af: AngularFireDatabase) {
    this.user = this.afAuth.authState;
  }

  getGroupId() { return null; } //this.groupService.getGroupId(); }
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
