import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { MenuModelState } from '@/models/menu';
import { Dispatch, Effect, ImmerReducer, Subscription } from '@@/plugin-dva/connect';
import { GlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { UserModelState } from './user';
import { StateType } from './login';

export { GlobalModelState, SettingModelState, UserModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: UserModelState;
  login: StateType;
  menu: MenuModelState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
export interface AnyAction extends Action {
  // Allows any extra properties to be defined in an action.
  [extraProps: string]: any;
}
export interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): T
}


export interface Action<T = any> {
  type: T;
}

export interface ModelType<T> {
  namespace: string;
  state: T;
  effects?: {
    [key: string]: Effect;
  };
  reducers?: {
    [key: string]: Reducer<T> | ImmerReducer<T>;
  };
  subscriptions?: { [key: string]: Subscription };
}
export type Reducer<S = any, A extends Action = AnyAction> = (state: S, action: A) => S;
