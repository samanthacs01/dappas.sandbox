import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parsePathname = (
  str: string,
  params: Record<string, string | number>,
): string => {
  let result = str;
  for (const key in params) {
    const regex = new RegExp(`:${key}`, 'g');
    result = result.replaceAll(regex, String(params[key]));
  }
  return result;
};
