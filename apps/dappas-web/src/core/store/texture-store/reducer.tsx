import { TAction } from './actions';
import { TextureState } from './initial-state';

const reducer = (state: TextureState, action: TAction): TextureState => {
  const { type } = action;

  switch (type) {
    case 'CURRENT_MODEL':
      return {
        ...state,
        currentModel: action.payload,
      };
    case 'AVAILABLE_TEXTURES':
      return {
        ...state,
        availableTextures: action.payload,
      };
    case 'CURRENT_TEXTURE':
      return {
        ...state,
        currentTexture: action.payload,
      };
    case 'CURRENT_DIMENSIONS':
      return {
        ...state,
        currentDimensions: action.payload,
      };
    case 'TEXT_ZONES':
      return {
        ...state,
        textZones: {
          ...state.textZones,
          [state.activeZone as string]: action.payload,
        },
      };
    case 'ACTIVE_ZONE':
      return {
        ...state,
        activeZone: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
