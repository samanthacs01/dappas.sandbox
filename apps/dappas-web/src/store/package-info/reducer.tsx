import { TAction } from './actions';
import { PackagingInfo } from '@/server/schemas/brand';

const reducer = (state: PackagingInfo, action: TAction): PackagingInfo => {
  const { type } = action;

  switch (type) {
    case 'UPDATE_PACKAGE_INFO':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
