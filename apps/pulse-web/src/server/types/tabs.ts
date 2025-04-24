import { ReactNode } from 'react';

export interface TabType {
  label: string;
  value: string;
}

export type AdditionalData = Record<string, ReactNode>;
