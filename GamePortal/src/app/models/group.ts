import {ChatMessage} from './chat_message';

export class Group {
  $groupId?: string;
  participants: {
    $participantUserId: {
      participantIndex: number;
    }
  };
  groupName: string;
  createdOn: number;
  messages: ChatMessage[];
}
