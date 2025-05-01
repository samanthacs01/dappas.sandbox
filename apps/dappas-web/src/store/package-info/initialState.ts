import { PackagingInfo } from '@/server/schemas/brand';

const initialState: PackagingInfo = {
  product: '',
  brand: '',
  description: '',
  colors: [],
  style: '',
  logo: '',
  packageType: '',
};

export default initialState;
