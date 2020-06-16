import { ConnectState, UserModelState } from '@/models/connect';
import { useSelector } from 'dva';
import { getAuthority } from '@/utils/authority';

const checkPermission = (name: string) => {
  const isAllowed = (permissions: string[]) => permissions.indexOf(name) > -1;

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
