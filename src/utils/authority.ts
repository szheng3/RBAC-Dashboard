import { reloadAuthorized } from './Authorized';

import jwtDecode from 'jwt-decode';
import { get } from '@/utils/StorageUtil';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string[] {
  const authorityString = typeof str === 'undefined' ? get('sso') : str;

  let authority;

  if (authorityString !== null) {
    try {
      if (authorityString != null) {
        authority = (jwtDecode(authorityString) as any).aud;
      }
    } catch (e) {
      authority = authorityString;
    }
  }

  if (typeof authority === 'string') {
    return [authority];
  }

  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION ===
    'site') {
    return ['admin'];
  }

  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('token', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}
