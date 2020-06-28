import request from '@/utils/request';
import { CreateParams, TableListParams, UpdateParams } from './data.d';

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

export async function updateMenuAsync([params]: any) {
  return request(`/oauth2/menus`, {
    method: 'POST',
    data: {
      ...params as UpdateParams,
    },
  });
}
