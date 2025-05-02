import { PackagingInfo } from '@/server/schemas/brand';

export type PackageTypes = 'UPDATE_PACKAGE_INFO';

type Action<T> = {
  type: PackageTypes;
  payload: T;
};

interface IAddInfo extends Action<PackagingInfo> {
  type: 'UPDATE_PACKAGE_INFO';
}

export type TAction = IAddInfo;
