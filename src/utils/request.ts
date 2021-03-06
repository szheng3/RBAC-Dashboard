/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend, RequestOptionsInit } from 'umi-request';
import { notification } from 'antd';
import { get } from '@/utils/StorageUtil';
import { getDvaApp, history } from 'umi';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
// const errorHandler = (error: { response: Response }): Response => {
//   const { response } = error;
//   if (response && response.status) {
//     const errorText = codeMessage[response.status] || response.statusText;
//     const { status, url } = response;
//
//     notification.error({
//       message: `请求错误 ${status}: ${url}`,
//       description: errorText,
//     });
//   } else if (!response) {
//     notification.error({
//       description: '您的网络发生异常，无法连接服务器',
//       message: '网络异常',
//     });
//   }
//   return response;
// };
const errorHandler = (error: { data?: string; response: Response }): Response | void => {
  const { response } = error;
  const { status, url, statusText } = response;

  if (response && status >= 200 && status < 300) {
    return response;
  }

  const errorText = codeMessage[status] || statusText;

  notification.error({
    message: `请求错误 ${status}: ${url}`,
    description: JSON.stringify(error?.data),
  });

  if (status === 401) {
    // notification.error({
    //   message: '未登录或登录已过期，请重新登录。',
    // });
    // eslint-disable-next-line no-unused-expressions
    getDvaApp()?._store?.dispatch({
      type: 'login/logout',
    });
    window.location.reload();
    // return;
  }

  if (status === 403) {
    history.push('/exception/403');
    // eslint-disable-next-line consistent-return
    return;
  }

  if (status === 500) {
    history.push('/exception/500');
    // eslint-disable-next-line consistent-return
    return;
  }

  const myError: any = new Error(errorText);
  myError.name = response.status;
  myError.response = response;
  throw error;
};

export const DOMAIN =
  process.env.NODE_ENV === 'production'
    ? `https://splice.passgpa.com`
    : `https://splice.passgpa.com`;

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  prefix: `${DOMAIN}`,
  headers: {
    Authorization: `Bearer ${get('sso')}`,
  },
});

const myRequest = (url: string, options: RequestOptionsInit | undefined = {}) => {
  return request(url, {
    ...options,
    headers: {
      ...options!.headers,
      Authorization: `Bearer ${get('sso')}`,
    },
  });
};

export default myRequest;
