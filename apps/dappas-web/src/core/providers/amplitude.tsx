'use client';
import { init, track } from '@amplitude/analytics-browser';
import { createContext, useEffect } from 'react';

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? '';

export const AmplitudeContext = createContext({
  trackAmplitudeEvent: (
    eventName: string,
    eventProperties: Record<string, string>
  ) => {
    console.log(eventName, eventProperties);
  },
});

const AmplitudeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    init(AMPLITUDE_API_KEY, {
      autocapture: true,
    });
  }, []);

  const trackAmplitudeEvent = (
    eventName: string,
    eventProperties: Record<string, string>
  ) => {
    track(eventName, eventProperties);
  };

  const value = { trackAmplitudeEvent };

  return <AmplitudeContext value={value}>{children}</AmplitudeContext>;
};

export default AmplitudeContextProvider;
