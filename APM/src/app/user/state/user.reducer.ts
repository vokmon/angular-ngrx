
import { User } from '../user';
import { UserActions, UserActionTypes } from './user.action';

export interface UserState {
  maskUserName: boolean;
  currentUser: User;
}

const initialState: UserState = {
  maskUserName: false,
  currentUser: null,
};

export function reducer(state: UserState = initialState, action: UserActions) {
  switch (action.type) {

    case UserActionTypes.ToggleMaskUserName :
      return {
        ...state,
        maskUserName: action.payload,
      };

    default:
      return state;
  }
}
