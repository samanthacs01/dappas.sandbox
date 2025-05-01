'use client';
import { Dispatch, createContext } from 'react';
import { TAction } from './actions';
import initialState from './initialState';
import { PackagingInfo } from '@/server/schemas/brand';

interface IContextProps {
  state: PackagingInfo;
  dispatch: Dispatch<TAction>;
}
const PackageContext = createContext<IContextProps>({
  state: initialState,
  dispatch: () => {},
});
export default PackageContext;
