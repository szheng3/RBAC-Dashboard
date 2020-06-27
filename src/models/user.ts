import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryCurrent, query as queryUsers } from '@/services/user';
import { TableListItem as RoleData } from '../pages/admin/roles/list/data.d';

export interface CurrentUser {
  avatar?: string;
  userid?: string;
  roles?: RoleData[];
  isAdmin?: boolean;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType<T> {
  namespace: 'user';
  state: T;
  effects: {
    [key: string]: Effect;
  };
  reducers: {
    [key: string]: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType<UserModelState> = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);

      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
