import request from '@/utils/request';
import { TableListParams, CreateParams, UpdateParams } from './data.d';

export async function queryMenus(params?: TableListParams) {
  return request('/oauth2/menus', {
    params,
  });
}

export async function addMenu(params: CreateParams) {
  return request('/oauth2/menus', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateMenu(params: UpdateParams) {
  return request(`/oauth2/menus`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
