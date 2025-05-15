import { CoffeeCupModel } from '@/core/components/3d-designer/models/coffe-cup-model';
import { JSX } from 'react';

type ModelComponentProps = {
  texture: string;
};

type ModelComponent = (props: ModelComponentProps) => JSX.Element;

export const modelDictionary: Record<string, ModelComponent> = {
  CoffeeCupModel: (props) => <CoffeeCupModel textureUrl={props.texture} />,
};
