'use client';

import { Button } from '@/core/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/core/components/ui/tooltip';
import { feedbackIntegration, getFeedback } from '@sentry/nextjs';
import { Bug } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLayoutEffect, useRef } from 'react';

export interface ActorComponent {
  el: HTMLElement;
  appendToDom: () => void;
  removeFromDom: () => void;
  show: () => void;
  hide: () => void;
}

const AppBarFeedbackButton = () => {
  const feedbackRef = useRef<ReturnType<typeof getFeedback> | undefined>(
    undefined,
  );
  const theme = useTheme();

  const initFeedback = () => {
    if (!feedbackRef.current) {
      const _feedback = feedbackIntegration({
        // Disable the injection of the default widget
        autoInject: false,
        colorScheme: theme.theme,
        showBranding: false,
        useSentryUser: {
          name: 'fullName',
          email: 'email',
        },
      });
      const button = document.querySelector('#user-feedback');
      if (button) {
        _feedback.attachTo(button, {
          formTitle: 'Report a Bug!',
        });
      }
      feedbackRef.current = _feedback;
    }
  };

  useLayoutEffect(() => {
    initFeedback();
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button id="user-feedback" type="button" variant="ghost" size="icon">
            <Bug className="!size-5" />
            <span className="sr-only">Report a bug</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Report a bug</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AppBarFeedbackButton;
