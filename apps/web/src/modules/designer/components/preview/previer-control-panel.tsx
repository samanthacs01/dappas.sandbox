import React from 'react';
import { Button } from '@workspace/ui/components/button';
import { Play, RotateCw, StopCircle } from 'lucide-react';

type PreviewControlPanelProps = {
  isPlaying?: boolean;
  isRotating?: boolean;
  onStop: () => void;
  onPlay: () => void;
};

const PreviewControlPanel: React.FC<PreviewControlPanelProps> = ({
  onPlay,
  isPlaying,
  onStop,
  isRotating,
}) => {
  return (
    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
      <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow">
        {/*<Tooltip>*/}
        {/*  <TooltipTrigger asChild>*/}
        <Button
          onClick={onPlay}
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100"
        >
          {isPlaying ? (
            <StopCircle className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        {/*  </TooltipTrigger>*/}
        {/*  <TooltipContent side="right">*/}
        {/*    <p>Play animation</p>*/}
        {/*  </TooltipContent>*/}
        {/*</Tooltip>*/}

        {/*<Tooltip>*/}
        {/*<TooltipTrigger asChild>*/}
        <Button
          onClick={onStop}
          variant={isRotating ? 'default' : 'ghost'}
          size="icon"
          className="hover:bg-gray-100"
        >
          <RotateCw className="h-5 w-5" />
        </Button>
        {/*</TooltipTrigger>*/}
        {/*<TooltipContent side="right">*/}
        {/*  <p>Stop rotate </p>*/}
        {/*</TooltipContent>*/}
        {/*</Tooltip>*/}
      </div>
    </div>
  );
};

export default PreviewControlPanel;
