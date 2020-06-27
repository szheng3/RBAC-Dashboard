import request from '@/utils/request';

export async function queryMenus(): Promise<any> {
  return request('/oauth2/menus/fetch');
}

