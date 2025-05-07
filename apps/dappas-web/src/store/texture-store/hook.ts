import { useContext } from 'react';
import TextureContext, { type IContextProps } from './context';

const useTextureContext = (): IContextProps => {
  return useContext(TextureContext);
};

export default useTextureContext;
