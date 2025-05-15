'use client';
import { Dispatch, createContext } from 'react';
import { TAction } from './actions';
import initialState, { TextureState } from './initial-state';

export interface IContextProps {
  state: TextureState;
  dispatch: Dispatch<TAction>;
}
const TextureContext = createContext<IContextProps>({
  state: initialState,
  dispatch: () => {},
});
export default TextureContext;
