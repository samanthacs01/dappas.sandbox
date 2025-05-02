import { PackagingInfo } from '@/server/schemas/brand';

export type PackageState = {
  packageInfo: PackagingInfo;
};

const initialState: PackageState = {
  packageInfo: {
    product: '',
    brand: '',
    description: '',
    colors: [],
    style: '',
    logo: '',
    packageType: '',
  },
};

export default initialState;
