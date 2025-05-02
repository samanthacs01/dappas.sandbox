'use client';
import { Dispatch, createContext } from 'react';
import { TAction } from './actions';
import initialState, { PackageState } from './initialState';

interface IContextProps {
  state: PackageState;
  dispatch: Dispatch<TAction>;
}
const PackageContext = createContext<IContextProps>({
  state: initialState,
  dispatch: () => {},
});
export default PackageContext;
