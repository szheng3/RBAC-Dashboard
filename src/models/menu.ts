import { ModelType } from '@/typings';
import { queryMenus } from '@/services/menu';


export interface Permission {
  name: string;
  createDate: Date;
  updateDate: Date;
  _id: string;
}


export interface MenuType {
  idMenu: number;
  icon: string;
  name: string;
  path: string;
  idParent?: any;
  createDate: Date;
  updateDate: Date;
  children: MenuType[];
  permissions: Permission[];
}

export interface MenuModelState {
  menu?: MenuType[];
}

const MenuModel: ModelType<MenuModelState> = {
  namespace: 'menu',

  state: { menu: [] },

  effects: {
    * fetch(_, { call, put }) {
      const response = yield call(queryMenus);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, { payload }) {
      state.menu = payload || [];
    },
  },
};

export default MenuModel;