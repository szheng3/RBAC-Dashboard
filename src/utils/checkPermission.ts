import { getAuthority } from '@/utils/authority';

export enum PermissionsEnum {
  MENU_WRITE = 'MENU_WRITE',
  PERMISSION_WRITE = 'PERMISSION_WRITE',
  ROLES_WRITE = 'ROLES_WRITE',
  USERS_WRITE = 'USERS_WRITE',
}
const checkPermission = (name: PermissionsEnum) => {
  const isAllowed = (permissions: string[]) => permissions?.indexOf(name) > -1;

  // const { currentUser } = useSelector<ConnectState, UserModelState>(
  //   state => state.user);
  //
  // if (currentUser && currentUser.isAdmin) {
  //   return true;
  // }

  if (isAllowed(getAuthority())) {
    return true;
  }

  return false;
};

export default checkPermission;
