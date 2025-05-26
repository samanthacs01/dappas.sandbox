import { ObjectDimensions, TextZone } from '@/server/models/texture';

export type TextureState = {
  currentModel: string;
  currentTexture: string;
  currentDimensions: ObjectDimensions;
  textZones: Record<string, TextZone>;
  activeZone: string | null;
  availableTextures: string[];
};

const initialState: TextureState = {
  currentModel: 'box',
  currentTexture: 'green-paper',
  currentDimensions: {
    width: 2,
    height: 1.5,
    depth: 1.0,
  },
  textZones: {},
  activeZone: null,
  availableTextures: ["green-paper", "white-paper", "kraft"],

};

export default initialState;
