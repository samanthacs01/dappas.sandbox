import { FC, PropsWithChildren } from 'react';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UiTooltip,
} from '../../ui/tooltip';

type TooltipProps = {
  title: string;
};

export const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({
  title,
  children,
}) => {
  return (
    <TooltipProvider>
      <UiTooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </UiTooltip>
    </TooltipProvider>
  );
};
