import { CoffeeCupModel } from '@/core/components/3d-designer/models/coffe-cup-model';
import { JSX } from 'react';

type ModelComponentProps = {
  texture: string;
  playRotation: boolean;
  playAnimation: boolean;
};

type ModelComponent = (props: ModelComponentProps) => JSX.Element;

export const modelDictionary: Record<string, ModelComponent> = {
  CoffeeCupModel: (props) => (
    <CoffeeCupModel
      playRotation={props.playRotation}
      playAnimation={props.playAnimation}
      textureUrl={props.texture}
    />
  ),
};
