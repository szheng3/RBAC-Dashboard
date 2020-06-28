import { stringify } from 'querystring';
import { history } from 'umi';

import { fakeAccountLogin, getFakeCaptcha } from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { reloadAuthorized } from '@/utils/Authorized';
import { remove, save } from '@/utils/StorageUtil';
import { ModelType } from '@/models/connect';

export interface StateType {
  success?: boolean | null | undefined;
}

const Model: ModelType<StateType> = {
  namespace: 'login',

  state: {
    success: null,
  },

  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(fakeAccountLogin, payload);

        console.log(response)
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });

        if (response?.accessToken) {
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params as { redirect: string };
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = '/';
              return;
            }
          }

          save('sso', response.accessToken);

          reloadAuthorized();

          history.replace(redirect || '/');
        }
      } catch (e) {
        // message.error(e.data.message);

        yield put({
          type: 'changeLoginStatus',
          payload: e.data,
        });
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
        setTimeout(() => {
          remove('sso');
        }, 200);
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      return {
        ...state,
        success: payload?.success,
      };
    },
  },
};

export default Model;
