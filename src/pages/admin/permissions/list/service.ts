import request from '@/utils/request';
import { TableListParams, CreateParams } from './data.d';
import { FormValueType } from './components/UpdateForm';

export async function queryPermissions(params?: TableListParams) {
  return request('/oauth2/permissions', {
    params,
  });
}

export async function addPermission(params: CreateParams) {
  return request('/oauth2/permissions', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updatePermission(params: FormValueType) {
  return request('/oauth2/permissions', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
