
import { User } from '../user';
import * as fromRoot from '../../state/app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State extends fromRoot.State {
  user: UserState;
}

export interface UserState {
  maskUserName: boolean;
  currentUser: User;
}

const initialState: UserState = {
  maskUserName: false,
  currentUser: null,
};

const getUserFeatureState = createFeatureSelector<UserState>('user');

export const getMaskUserName = createSelector(
  getUserFeatureState,
  state => state.maskUserName
);

export const getCurrentUser = createSelector(
  getUserFeatureState,
  state => state.currentUser
);

export function reducer(state: UserState = initialState, action) {
  switch (action.type) {

    case 'TOGGLE_MASK_USER_NAME' :
      return {
        ...state,
        maskUserName: action.payload,
      };

    default:
      return state;
  }
}
