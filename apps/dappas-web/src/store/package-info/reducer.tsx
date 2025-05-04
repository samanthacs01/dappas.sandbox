import { packageInfo } from '@/server/ai/tools';
import { TAction } from './actions';
import { PackageState } from './initialState';

const reducer = (state: PackageState, action: TAction): PackageState => {
  const { type } = action;

  switch (type) {
    case 'UPDATE_PACKAGE_INFO':
      return {
        ...state,
        packageInfo: { ...packageInfo, ...action.payload },
      };
    default:
      return state;
  }
};

export default reducer;
