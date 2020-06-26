import request from '@/utils/request';
import { TableListParams, CreateParams, RoleFormParams } from './data.d';
import { FormValueType } from './components/UpdateForm';

export async function queryUsers(params?: TableListParams) {
  return request('/oauth2/users', {
    params,
  });
}

export async function addUser(params: CreateParams) {
  return request('/oauth2/users', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateUser(params: FormValueType) {
  return request(`/oauth2/users`, {
    method: 'post',
    data: {
      ...params,
    },
  });
}

export async function setRoles(params: RoleFormParams) {
  return request(`/oauth2/userHasRoles`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
