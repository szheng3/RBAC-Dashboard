import { queryCurrent, query as queryUsers } from '@/services/user';
import { TableListItem as RoleData } from '../pages/admin/roles/list/data.d';
import { ModelType } from '@/models/connect';

export interface CurrentUser {
  avatar?: string;
  userid?: string;
  name?: string;
  roles?: RoleData[];
  isAdmin?: boolean;
  unreadCount?: any;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

const UserModel: ModelType<UserModelState> = {
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
