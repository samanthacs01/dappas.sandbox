'use client';
import { init, track as trackAmplitude } from '@amplitude/analytics-browser';
import { createContext, useEffect } from 'react';

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? '';

export const AmplitudeContext = createContext({
  track: (
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

  const track = (
    eventName: string,
    eventProperties: Record<string, string>
  ) => {
    trackAmplitude(eventName, eventProperties);
  };

  const value = { track };

  return <AmplitudeContext value={value}>{children}</AmplitudeContext>;
};

export default AmplitudeContextProvider;
