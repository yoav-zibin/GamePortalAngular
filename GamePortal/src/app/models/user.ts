// may have to adjust according to rules:
export class User {
  $userId?: string;
  publicFields: {
    avatarImageUrl?: string;
    displayName?: string;
    isConnected?: boolean,
    lastSeen?: number;
  };
  privateFields: {
    email?: string;
    createdOn?: number;
    phoneNumber?: string;
    facebookId?: string;
    // 'googleId': user.email,
    googleId?: string;
    twitterId?: string;
    githubId?: string;
    friends?: string;
    pushNotificationsToken?: string;
  };
  privateButAddable: {
    groups?: {
      $memberOfGroupId?: {
        addedByUid?: string;
        timestamp?: number;
      };
      signal?: {
        $signalId?: {
          addedByUid?: string;
          timestamp?: number;
          signalData?: string;
        }
      }
    }
  };
}
