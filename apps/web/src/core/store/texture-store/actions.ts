import * as types from './types';
import { ObjectDimensions, TextZone } from '@/server/models/texture';

type CurrentModel = {
  type: types.CURRENT_MODEL;
  payload: string;
};

type CurrentTexture = {
  type: types.CURRENT_TEXTURE;
  payload: string;
};

type CurrentDimensions = {
  type: types.CURRENT_DIMENSIONS;
  payload: ObjectDimensions;
};

type TextZones = {
  type: types.TEXT_ZONES;
  payload: TextZone;
};

type ActiveZone = {
  type: types.ACTIVE_ZONE;
  payload: string | null;
};

type AvailableTextures = {
  type: types.AVAILABLE_TEXTURES;
  payload: string[];
};

export type TAction =
  | CurrentModel
  | CurrentTexture
  | CurrentDimensions
  | TextZones
  | ActiveZone
  | AvailableTextures;
