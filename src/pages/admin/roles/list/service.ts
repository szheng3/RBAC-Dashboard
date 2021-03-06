import request from '@/utils/request';
import { TableListParams, CreateParams, PermissionFormParams } from './data.d';
import { FormValueType } from './components/UpdateForm';

export async function queryRoles(params?: TableListParams) {
  return request('/oauth2/roles', {
    params,
  });
}

export async function addRole(params: CreateParams) {
  return request('/oauth2/roles', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRole(params: FormValueType) {
  return request(`/oauth2/roles`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function setPermissions(params: PermissionFormParams) {
  return request(`/oauth2/roleHasPermissions`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
