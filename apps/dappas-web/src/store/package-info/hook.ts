import { useContext } from 'react';
import PackageContext, { type IContextProps } from './context';


const usePackageContext = (): IContextProps => {
  return useContext(PackageContext);
};

export default usePackageContext;
