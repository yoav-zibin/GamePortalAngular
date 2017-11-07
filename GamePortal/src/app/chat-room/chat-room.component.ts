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
  public groupId: any;
  participants: any;
  groupName: any;
  constructor(private afAuth: AngularFireAuth, private af: AngularFireDatabase, private groupService: GroupService) {
    this.user = this.afAuth.authState;
    this.groupId = this.groupService.getObservable();
    this.groupId.subscribe(gid => {
      this.groupName = this.af.database.ref('gamePortal/groups/' + gid + '/groupName').once(
        'value').then( res => {
        this.groupName = res.val();
      });
      // uid
      this.af.list('gamePortal/groups/' + gid + '/participants').valueChanges().subscribe(res => {
        this.participants = res;
        console.log(res[0]);
      });
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
