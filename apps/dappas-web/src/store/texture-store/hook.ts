import { useContext } from 'react';
import TextureContext from './context';

const useTextureContext = () => {
  return useContext(TextureContext);
};

export default useTextureContext;
