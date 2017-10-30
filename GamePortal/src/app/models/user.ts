// may have to adjust according to rules:
export class User {
  $userId?: string;
  publicFields: {
    'avatarImageUrl'?: string;
    'displayName'?: string;
    'isConnected'?: boolean,
    'lastSeen'?: string;
  };
  privateFields: {
    'email'?: string;
    'createdOn'?: string;
    'phoneNumber'?: string;
    'facebookId'?: string;
    // 'googleId': user.email,
    'googleId'?: string;
    'twitterId'?: string;
    'githubId'?: string;
    'friends'?: string;
    'pushNotificationsToken'?: string;
  };
  privateButAddable: {
    'groups'?: {
      $memberOfGroupId?: {
        'addedByUid'?: string;
        'timestamp'?: string;
      };
      'signal'?: {
        $signalId?: {
          'addedByUid'?: string;
          'timestamp'?: string;
          'signalData'?: string;
        }
      }
    }
  };
}
