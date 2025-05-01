import { useContext } from 'react';
import PackageContext from './context';

const usePackageContext = () => {
  return useContext(PackageContext);
};

export default usePackageContext;
